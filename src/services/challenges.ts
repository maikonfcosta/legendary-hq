import { db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc, orderBy, limit } from 'firebase/firestore';

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  game: string;
  seedData: {
    mastermind: string;
    scheme: string;
    villains: string[];
    henchmen: string[];
    heroes: string[];
  };
}

// Buscar desafio ativo global (Legendary)
export async function getActiveChallenge(): Promise<ChallengeData | null> {
  try {
    const q = query(collection(db, 'challenges'), where('isActive', '==', true), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty && snap.docs.length > 0) {
      return { id: snap.docs[0]!.id, ...snap.docs[0]!.data() } as ChallengeData;
    }
  } catch (error) {
    console.error("Erro ao buscar desafio ativo no Firebase", error);
  }
  
  // Fallback Mock
  return {
    id: "legendary_weekly_01",
    title: "O Retorno do Rei do Crime",
    description: "Derrote o Kingpin num Esquema de Roubo a Banco antes que ele corrompa todos os heróis da cidade.",
    isActive: true,
    game: "legendary",
    seedData: {
      mastermind: "Kingpin",
      scheme: "The Crown of Atlantis", // Usando schemes do core para testar
      villains: ["Streets of New York"],
      henchmen: ["Maggia Goons"],
      heroes: ["Daredevil", "Spider-Man", "Elektra"]
    }
  };
}

export async function getChallengeLeaderboard(challengeId: string) {
  try {
    const q = query(collection(db, 'leaderboards', challengeId, 'entries'), orderBy('xpGained', 'desc'), limit(50));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch (error) {
    console.error("Erro ao buscar leaderboard", error);
    return [];
  }
}

export async function submitChallengeLog(challengeId: string, currentUser: any, result: any) {
  if (!currentUser || !currentUser.uid) {
    throw new Error('Usuário precisa estar logado para salvar o desafio.');
  }
  try {
    const logRef = doc(db, 'lhq_challenges_logs', `${challengeId}_${currentUser.uid}`);
    await setDoc(logRef, {
      userId: currentUser.uid,
      userName: currentUser.displayName || 'Jogador Anônimo',
      photoURL: currentUser.photoURL || null,
      date: new Date().toISOString(),
      ...result
    }, { merge: true });
  } catch (error) {
    console.error("Erro ao salvar log do desafio", error);
  }
}
