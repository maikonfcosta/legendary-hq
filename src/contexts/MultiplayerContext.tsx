import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import Peer from 'peerjs';
import type { DataConnection } from 'peerjs';

interface GameState {
  recruit: number;
  attack: number;
  masterStrikes: number;
  schemeTwists: number;
  bystanders: number;
}

interface MultiplayerContextData {
  peerId: string | null;
  connections: DataConnection[];
  isHost: boolean;
  isConnected: boolean;
  hostGame: () => Promise<string>;
  joinGame: (hostId: string) => Promise<void>;
  disconnect: () => void;
  gameState: GameState;
  updateGameState: (newStateOrFn: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => void;
  resetGameState: () => void;
}

const MultiplayerContext = createContext<MultiplayerContextData>({} as MultiplayerContextData);

const INITIAL_STATE: GameState = {
  recruit: 0,
  attack: 0,
  masterStrikes: 0,
  schemeTwists: 0,
  bystanders: 0,
};

const PEER_OPTIONS = {
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun.cloudflare.com:3478' }
    ]
  }
};

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connections, setConnections] = useState<DataConnection[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('lhq_multiplayer_state');
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch {
      return INITIAL_STATE;
    }
  });

  const connectionsRef = useRef<DataConnection[]>([]);
  const gameStateRef = useRef<GameState>(gameState);
  const isHostRef = useRef<boolean>(false);
  const peerRef = useRef<Peer | null>(null);

  useEffect(() => {
    gameStateRef.current = gameState;
    localStorage.setItem('lhq_multiplayer_state', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    connectionsRef.current = connections;
  }, [connections]);

  useEffect(() => {
    isHostRef.current = isHost;
  }, [isHost]);

  useEffect(() => {
    peerRef.current = peer;
  }, [peer]);

  const updateGameState = useCallback((newStateOrFn: Partial<GameState> | ((prev: GameState) => Partial<GameState>)) => {
    setGameState((prev) => {
      const delta = typeof newStateOrFn === 'function' ? newStateOrFn(prev) : newStateOrFn;
      const updated = { ...prev, ...delta };
      gameStateRef.current = updated;

      // Broadcast delta if connected
      const payload = { type: 'STATE_DELTA', delta };
      connectionsRef.current.forEach(conn => {
        if (conn.open) {
          conn.send(payload);
        }
      });
      return updated;
    });
  }, []);

  const resetGameState = useCallback(() => {
    setGameState(() => {
      gameStateRef.current = INITIAL_STATE;
      const payload = { type: 'STATE_UPDATE', state: INITIAL_STATE };
      connectionsRef.current.forEach(conn => {
        if (conn.open) {
          conn.send(payload);
        }
      });
      return INITIAL_STATE;
    });
  }, []);

  const setupConnectionListeners = useCallback((conn: DataConnection) => {
    conn.on('open', () => {
      connectionsRef.current = [...connectionsRef.current.filter(c => c.peer !== conn.peer), conn];
      setConnections(connectionsRef.current);
      setIsConnected(true);
      // If host, send current state snapshot to new client
      if (isHostRef.current) {
        conn.send({ type: 'STATE_UPDATE', state: gameStateRef.current });
      }
    });

    conn.on('data', (data: any) => {
      if (!data) return;

      if (data.type === 'STATE_DELTA' && data.delta) {
        setGameState(prev => {
          const next = { ...prev, ...data.delta };
          gameStateRef.current = next;
          // If host, forward to other clients
          if (isHostRef.current) {
            connectionsRef.current.forEach(c => {
              if (c.peer !== conn.peer && c.open) {
                c.send(data);
              }
            });
          }
          return next;
        });
      } else if (data.type === 'STATE_UPDATE' && data.state) {
        setGameState(data.state);
        gameStateRef.current = data.state;
        if (isHostRef.current) {
          connectionsRef.current.forEach(c => {
            if (c.peer !== conn.peer && c.open) {
              c.send(data);
            }
          });
        }
      }
    });

    conn.on('close', () => {
      connectionsRef.current = connectionsRef.current.filter(c => c.peer !== conn.peer);
      setConnections(connectionsRef.current);
      if (connectionsRef.current.length === 0) {
        setIsConnected(false);
      }
    });

    conn.on('error', (err) => {
      console.warn('Peer connection error:', err);
    });
  }, []);

  const disconnect = useCallback(() => {
    connectionsRef.current.forEach(conn => {
      try { conn.close(); } catch {}
    });
    if (peerRef.current) {
      try { peerRef.current.destroy(); } catch {}
    }
    peerRef.current = null;
    connectionsRef.current = [];
    isHostRef.current = false;

    setPeer(null);
    setPeerId(null);
    setConnections([]);
    setIsHost(false);
    setIsConnected(false);
  }, []);

  const hostGame = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      disconnect();
      const newPeer = new Peer(PEER_OPTIONS);
      
      newPeer.on('open', (id) => {
        setPeerId(id);
        setIsHost(true);
        isHostRef.current = true;
        resolve(id);
      });

      newPeer.on('connection', (conn) => {
        setupConnectionListeners(conn);
      });

      newPeer.on('error', (err) => {
        reject(err);
      });

      setPeer(newPeer);
      peerRef.current = newPeer;
    });
  };

  const joinGame = (hostId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      disconnect();
      const newPeer = new Peer(PEER_OPTIONS);

      newPeer.on('open', () => {
        const conn = newPeer.connect(hostId, { reliable: true });
        setupConnectionListeners(conn);
        setPeerId(newPeer.id);
        setIsHost(false);
        isHostRef.current = false;
        
        conn.on('open', () => resolve());
      });

      newPeer.on('error', (err) => {
        reject(err);
      });

      setPeer(newPeer);
      peerRef.current = newPeer;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      connectionsRef.current.forEach(c => {
        try { c.close(); } catch {}
      });
      if (peerRef.current) {
        try { peerRef.current.destroy(); } catch {}
      }
    };
  }, []);

  return (
    <MultiplayerContext.Provider
      value={{
        peerId,
        connections,
        isHost,
        isConnected,
        hostGame,
        joinGame,
        disconnect,
        gameState,
        updateGameState,
        resetGameState,
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => useContext(MultiplayerContext);
