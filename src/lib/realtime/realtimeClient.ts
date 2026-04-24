import Ably from "ably";
import type {
  IRealtimeClient,
  RealtimeListener,
  RealtimeMessage,
} from "./realtimeTypes";
import type { ConnectionState, RealtimeEventName } from "@/types/patient";

// ─── Ably Realtime Client ──────────────────────────────────────────────────────

/**
 * Concrete implementation of IRealtimeClient using Ably.
 *
 * Why Ably?
 * - Fully managed pub/sub WebSocket service — no persistent server needed.
 * - Works on serverless / edge runtimes (Vercel, Netlify).
 * - Generous free tier (6M messages/month).
 * - First-class TypeScript SDK.
 *
 * Channel strategy: one Ably channel per sessionId (default: "demo").
 * This scopes all events for a session, making multi-session support trivial.
 */
export class AblyRealtimeClient implements IRealtimeClient {
  private client: Ably.Realtime | null = null;
  private channel: Ably.RealtimeChannel | null = null;
  private sessionId: string = "";
  private connectionHandlers: Array<(state: ConnectionState) => void> = [];
  // Map from eventName → Set of listener wrappers (so we can unsubscribe)
  private listenerMap = new Map<
    RealtimeEventName,
    Map<RealtimeListener, Ably.messageCallback<Ably.Message>>
  >();

  async connect(sessionId: string): Promise<void> {
    const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY;
    if (!apiKey) {
      console.warn(
        "[Ably] NEXT_PUBLIC_ABLY_API_KEY is not set. Real-time features will not work."
      );
      return;
    }

    this.sessionId = sessionId;

    // If already connected to the same session, skip
    if (
      this.client &&
      this.channel?.name === `agnos-patient:${sessionId}`
    ) {
      return;
    }

    // Clean up previous connection
    this.disconnect();

    this.client = new Ably.Realtime({ key: apiKey, autoConnect: true });

    // Forward Ably connection state changes to registered handlers
    this.client.connection.on((stateChange) => {
      const mapped = this.mapAblyState(stateChange.current);
      this.connectionHandlers.forEach((handler) => handler(mapped));
    });

    this.channel = this.client.channels.get(`agnos-patient:${sessionId}`);
    await this.channel.attach();
  }

  disconnect(): void {
    if (this.channel) {
      this.channel.detach();
      this.channel = null;
    }
    if (this.client) {
      this.client.close();
      this.client = null;
    }
    this.listenerMap.clear();
  }

  async publish<T>(event: RealtimeEventName, payload: T): Promise<void> {
    if (!this.channel) return;
    const message: RealtimeMessage<T> = {
      event,
      sessionId: this.sessionId,
      payload,
      timestamp: new Date().toISOString(),
    };
    await this.channel.publish(event, message);
  }

  subscribe<T>(
    event: RealtimeEventName,
    listener: RealtimeListener<T>
  ): void {
    if (!this.channel) return;

    // Create a stable wrapper so we can unsubscribe later
    const wrapper: Ably.messageCallback<Ably.Message> = (msg: Ably.Message) => {
      listener(msg.data as RealtimeMessage<T>);
    };

    if (!this.listenerMap.has(event)) {
      this.listenerMap.set(event, new Map());
    }
    // Cast needed because the map holds generic listeners
    this.listenerMap
      .get(event)!
      .set(listener as RealtimeListener, wrapper);

    this.channel.subscribe(event, wrapper);
  }

  unsubscribe(event: RealtimeEventName, listener: RealtimeListener): void {
    if (!this.channel) return;
    const eventMap = this.listenerMap.get(event);
    if (!eventMap) return;
    const wrapper = eventMap.get(listener);
    if (wrapper) {
      this.channel.unsubscribe(event, wrapper);
      eventMap.delete(listener);
    }
  }

  getConnectionState(): ConnectionState {
    if (!this.client) return "disconnected";
    return this.mapAblyState(this.client.connection.state);
  }

  onConnectionStateChange(handler: (state: ConnectionState) => void): void {
    this.connectionHandlers.push(handler);
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private mapAblyState(state: string): ConnectionState {
    switch (state) {
      case "connected":
        return "connected";
      case "connecting":
      case "initialized":
        return "connecting";
      case "disconnected":
        return "disconnected";
      case "suspended":
        return "suspended";
      case "failed":
      case "closed":
        return "failed";
      default:
        return "disconnected";
    }
  }
}

// ─── Singleton Factory ─────────────────────────────────────────────────────────

let clientInstance: AblyRealtimeClient | null = null;

/**
 * Returns a singleton Ably client.
 * Singleton pattern avoids duplicate connections on hot-reloads in dev.
 */
export function getRealtimeClient(): AblyRealtimeClient {
  if (!clientInstance) {
    clientInstance = new AblyRealtimeClient();
  }
  return clientInstance;
}
