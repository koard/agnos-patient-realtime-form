"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getRealtimeClient } from "@/lib/realtime/realtimeClient";
import type { ConnectionState } from "@/types/patient";

/**
 * Hook that tracks the realtime connection state and exposes a stable
 * `reconnect` callback for manual retry.
 */
export function useConnectionStatus(sessionId: string) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    "connecting"
  );
  const client = useRef(getRealtimeClient());

  useEffect(() => {
    const c = client.current;

    // Register handler before connecting so we capture initial state
    c.onConnectionStateChange(setConnectionState);

    // Kick off connection
    c.connect(sessionId).then(() => {
      setConnectionState(c.getConnectionState());
    });

    return () => {
      // The client is a singleton; we don't disconnect on unmount because
      // the form and staff view share it. A full disconnect is done via
      // useRealtimePatient teardown.
    };
  }, [sessionId]);

  const reconnect = useCallback(() => {
    setConnectionState("connecting");
    client.current.connect(sessionId);
  }, [sessionId]);

  return { connectionState, reconnect };
}
