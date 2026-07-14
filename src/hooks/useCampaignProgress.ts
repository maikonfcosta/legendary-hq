import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

export interface CampaignProgress {
  [campaignId: string]: string[]; // Array of completed mission IDs
}

export function useCampaignProgress() {
  const [progress, setProgress] = useState<CampaignProgress>({});
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      const stored = localStorage.getItem('lhq_campaignProgress');
      if (stored) {
        try {
          setProgress(JSON.parse(stored));
        } catch { }
      }
      return;
    }

    const docRef = doc(db, 'users', currentUser.uid, 'settings', 'campaigns');

    const syncInitial = async () => {
      try {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists() || !snapshot.data().progress) {
          await setDoc(docRef, { progress }, { merge: true });
        }
      } catch (e) {
        console.error('Error fetching campaign progress:', e);
      }
    };
    syncInitial();

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.progress) {
          setProgress(data.progress);
        }
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const completeMission = async (campaignId: string, missionId: string) => {
    const newProgress = { ...progress };
    if (!newProgress[campaignId]) {
      newProgress[campaignId] = [];
    }
    
    if (!newProgress[campaignId].includes(missionId)) {
      newProgress[campaignId].push(missionId);
      setProgress(newProgress);

      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid, 'settings', 'campaigns');
        await setDoc(docRef, { progress: newProgress }, { merge: true });
      } else {
        localStorage.setItem('lhq_campaignProgress', JSON.stringify(newProgress));
      }
    }
  };

  return { progress, completeMission };
}
