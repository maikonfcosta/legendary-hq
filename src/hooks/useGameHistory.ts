import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { GameMatch } from '../types/history';

export function useGameHistory() {
  const { currentUser } = useAuth();
  
  const [localHistory, setLocalHistory] = useState<GameMatch[]>(() => {
    try {
      const item = window.localStorage.getItem('lhq_history');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('lhq_history', JSON.stringify(localHistory));
  }, [localHistory]);

  useEffect(() => {
    if (!currentUser) return;
    
    const docRef = doc(db, 'users', currentUser.uid);
    
    const syncInitial = async () => {
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists() || !snapshot.data().history) {
          await setDoc(docRef, { history: localHistory }, { merge: true });
        }
      } catch (e) {
        console.error('Error fetching history:', e);
      }
    };
    syncInitial();

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.history) {
          setLocalHistory(data.history);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addMatch = async (match: Omit<GameMatch, 'id' | 'date'>) => {
    const newMatch: GameMatch = {
      ...match,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    
    const newHistory = [newMatch, ...localHistory];
    setLocalHistory(newHistory);
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { history: newHistory }, { merge: true });
      } catch (err) {
        console.error("Falha ao salvar o histórico na nuvem", err);
      }
    }
  };

  const removeMatch = async (id: string) => {
    const newHistory = localHistory.filter(m => m.id !== id);
    setLocalHistory(newHistory);
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { history: newHistory }, { merge: true });
      } catch (err) {
        console.error("Falha ao remover o histórico", err);
      }
    }
  };

  return { history: localHistory, addMatch, removeMatch };
}
