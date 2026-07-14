import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useAvatar() {
  const { currentUser } = useAuth();
  
  const [localState, setLocalState] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem('lhq_avatarId');
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (localState) {
      window.localStorage.setItem('lhq_avatarId', localState);
    } else {
      window.localStorage.removeItem('lhq_avatarId');
    }
  }, [localState]);

  useEffect(() => {
    if (!currentUser) return;
    
    const docRef = doc(db, 'users', currentUser.uid);
    
    const syncInitial = async () => {
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists() && localState) {
          await setDoc(docRef, { avatarId: localState }, { merge: true });
        }
      } catch (e) {
        console.error('Error fetching doc:', e);
      }
    };
    
    syncInitial();

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.avatarId !== undefined) {
          setLocalState(data.avatarId);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const setSyncedState = async (value: string | null) => {
    setLocalState(value);
    
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { avatarId: value }, { merge: true });
      } catch (err) {
        console.error("Falha ao salvar avatar na nuvem", err);
      }
    }
  };

  return [localState, setSyncedState] as const;
}
