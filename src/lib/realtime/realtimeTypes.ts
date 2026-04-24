import type { RealtimeEventName, ConnectionState } from "@/types/patient";

// ─── Realtime Message Shape ────────────────────────────────────────────────────

export interface RealtimeMessage<T = unknown> {
  event: RealtimeEventName;
  sessionId: string;
  payload: T;
  timestamp: string;
}

// ─── Listener Callback ─────────────────────────────────────────────────────────

export type RealtimeListener<T = unknown> = (message: RealtimeMessage<T>) => void;

// ─── Realtime Client Interface ─────────────────────────────────────────────────

/**
 * Abstraction over any real-time provider.
 * Swapping providers (e.g. Ably → Pusher) only requires a new implementation
 * of this interface — UI components remain untouched.
 */
export interface IRealtimeClient {
  /** Connect to the realtime channel for the given session */
  connect(sessionId: string): Promise<void>;

  /** Disconnect and clean up */
  disconnect(): void;

  /** Publish an event on the current channel */
  publish<T>(event: RealtimeEventName, payload: T): Promise<void>;

  /** Subscribe to a specific event */
  subscribe<T>(event: RealtimeEventName, listener: RealtimeListener<T>): void;

  /** Unsubscribe from a specific event */
  unsubscribe(event: RealtimeEventName, listener: RealtimeListener): void;

  /** Current connection state */
  getConnectionState(): ConnectionState;

  /** Subscribe to connection state changes */
  onConnectionStateChange(handler: (state: ConnectionState) => void): void;
}
