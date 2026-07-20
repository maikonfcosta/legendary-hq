import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  updateGameState: (newState: Partial<GameState>) => void;
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

  useEffect(() => {
    localStorage.setItem('lhq_multiplayer_state', JSON.stringify(gameState));
  }, [gameState]);

  const updateGameState = useCallback((newState: Partial<GameState>) => {
    setGameState((prev) => {
      const updated = { ...prev, ...newState };
      // Broadcast if connected
      connections.forEach(conn => {
        if (conn.open) {
          conn.send({ type: 'STATE_UPDATE', state: updated });
        }
      });
      return updated;
    });
  }, [connections]);

  const resetGameState = useCallback(() => {
    updateGameState(INITIAL_STATE);
  }, [updateGameState]);

  const setupConnectionListeners = useCallback((conn: DataConnection) => {
    conn.on('open', () => {
      setConnections(prev => [...prev, conn]);
      setIsConnected(true);
      // If host, send current state to new client
      if (isHost) {
        conn.send({ type: 'STATE_UPDATE', state: gameState });
      }
    });

    conn.on('data', (data: any) => {
      if (data && data.type === 'STATE_UPDATE') {
        setGameState(data.state);
        // If host, forward to other clients
        if (isHost) {
          connections.forEach(c => {
            if (c.peer !== conn.peer && c.open) {
              c.send(data);
            }
          });
        }
      }
    });

    conn.on('close', () => {
      setConnections(prev => prev.filter(c => c.peer !== conn.peer));
      if (connections.length <= 1) {
        setIsConnected(false);
      }
    });
  }, [isHost, gameState, connections]);

  const hostGame = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      disconnect();
      const newPeer = new Peer();
      
      newPeer.on('open', (id) => {
        setPeerId(id);
        setIsHost(true);
        resolve(id);
      });

      newPeer.on('connection', (conn) => {
        setupConnectionListeners(conn);
      });

      newPeer.on('error', (err) => {
        reject(err);
      });

      setPeer(newPeer);
    });
  };

  const joinGame = (hostId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      disconnect();
      const newPeer = new Peer();

      newPeer.on('open', () => {
        const conn = newPeer.connect(hostId);
        setupConnectionListeners(conn);
        setPeerId(newPeer.id);
        setIsHost(false);
        
        conn.on('open', () => resolve());
      });

      newPeer.on('error', (err) => {
        reject(err);
      });

      setPeer(newPeer);
    });
  };

  const disconnect = useCallback(() => {
    connections.forEach(conn => conn.close());
    if (peer) {
      peer.destroy();
    }
    setPeer(null);
    setPeerId(null);
    setConnections([]);
    setIsHost(false);
    setIsConnected(false);
  }, [connections, peer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Quando a aplicação fecha, o browser fecha os sockets. 
      // Não reatrelar a disconnect para evitar race conditions com o React rodando cleanup.
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
