import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { SetupResult } from '../utils/randomizer';

export interface SavedSetup {
  id: string;
  name: string;
  createdAt: number;
  setup: SetupResult;
}

export function useSavedSetups() {
  const { currentUser } = useAuth();
  
  const [localSetups, setLocalSetups] = useState<SavedSetup[]>(() => {
    try {
      const item = window.localStorage.getItem('lhq_saved_setups');
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem('lhq_saved_setups', JSON.stringify(localSetups));
  }, [localSetups]);

  useEffect(() => {
    if (!currentUser) return;
    
    const docRef = doc(db, 'users', currentUser.uid);
    
    const syncInitial = async () => {
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists() || !snapshot.data().savedSetups) {
          await setDoc(docRef, { savedSetups: localSetups }, { merge: true });
        }
      } catch (e) {
        console.error('Error fetching setups:', e);
      }
    };
    syncInitial();

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.savedSetups) {
          setLocalSetups(data.savedSetups);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addSetup = async (name: string, setup: SetupResult) => {
    const newSetup: SavedSetup = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      setup
    };
    
    const newSetups = [newSetup, ...localSetups];
    setLocalSetups(newSetups);
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { savedSetups: newSetups }, { merge: true });
      } catch (err) {
        console.error("Falha ao salvar setup na nuvem", err);
      }
    }
  };

  const removeSetup = async (id: string) => {
    const newSetups = localSetups.filter(s => s.id !== id);
    setLocalSetups(newSetups);
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { savedSetups: newSetups }, { merge: true });
      } catch (err) {
        console.error("Falha ao remover o setup na nuvem", err);
      }
    }
  };

  return { savedSetups: localSetups, addSetup, removeSetup };
}
