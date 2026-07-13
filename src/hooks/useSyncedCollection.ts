import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

export function useSyncedCollection(key: string, initialValue: string[]) {
  const { currentUser } = useAuth();
  
  // Lê primeiramente do localStorage para ter carregamento imediato
  const [localState, setLocalState] = useState<string[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Atualiza LocalStorage sempre que o estado mudar
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(localState));
  }, [key, localState]);

  // Se o usuário estiver logado, escuta mudanças remotas
  useEffect(() => {
    if (!currentUser) return;
    
    const docRef = doc(db, 'users', currentUser.uid);
    
    const syncInitial = async () => {
      try {
        const snapshot = await getDoc(docRef);
        // Se a conta for nova na nuvem, grava o que tem no local nela
        if (!snapshot.exists()) {
          await setDoc(docRef, { ownedExpansions: localState }, { merge: true });
        }
      } catch (e) {
        console.error('Error fetching doc:', e);
      }
    };
    
    syncInitial();

    // Listener Real-time
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.ownedExpansions) {
          setLocalState(data.ownedExpansions);
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser]); // Removido localState para não reativar o listener todo clique

  // Atualizador do Estado (Atualiza Local + Cloud)
  const setSyncedState = async (valueOrFn: string[] | ((prev: string[]) => string[])) => {
    const newValue = typeof valueOrFn === 'function' ? valueOrFn(localState) : valueOrFn;
    
    // Atualização otimista na tela (sem loading)
    setLocalState(newValue);
    
    // Disparo p/ Firebase
    if (currentUser) {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        await setDoc(docRef, { ownedExpansions: newValue }, { merge: true });
      } catch (err) {
        console.error("Falha ao salvar a coleção na nuvem", err);
      }
    }
  };

  return [localState, setSyncedState] as const;
}
