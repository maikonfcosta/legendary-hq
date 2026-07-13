import imageDB from '../data/imageDB.json';

const images = imageDB as Record<string, string>;
const keys = Object.keys(images);

export const getCardImage = (cardName: string, category: 'mastermind' | 'scheme' | 'hero' | 'villain' | 'henchmen', expansion?: string): string | undefined => {
  const search = cardName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Encontrar todas as chaves que contêm o nome
  const matches = keys.filter(key => {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalizedKey.includes(search);
  });

  if (matches.length === 0) return undefined;

  // Ordenar as correspondências para pegar a melhor imagem
  matches.sort((a, b) => {
    const normA = a.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normB = b.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let scoreA = 0;
    let scoreB = 0;

    // 1. Prioridade máxima para início exato
    if (normA.startsWith(search)) scoreA += 100;
    if (normB.startsWith(search)) scoreB += 100;

    // Se for um herói, prioriza as artes clássicas (_1Rare, _2Common, etc.)
    if (category === 'hero') {
      if (normA.includes('1rare')) scoreA += 50;
      else if (normA.includes('rare') || normA.includes('common')) scoreA += 30;
      
      if (normB.includes('1rare')) scoreB += 50;
      else if (normB.includes('rare') || normB.includes('common')) scoreB += 30;
    }

    // 2. Lógica de expansão
    if (expansion) {
      const expSearch = expansion.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (expSearch !== 'core' && expSearch !== 'core2nd') {
        if (normA.includes(expSearch)) scoreA += 80;
        if (normB.includes(expSearch)) scoreB += 80;
      } else {
        // Core set: Penalizar duramente variantes
        const variants = ['mcu', 'noir', 'zombie', '2099', 'secretwars', '75', '1941', '10th', 'avengersassemble'];
        if (variants.some(v => normA.includes(v))) scoreA -= 200;
        if (variants.some(v => normB.includes(v))) scoreB -= 200;
      }
    }

    // Compara os scores finais
    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Maior score primeiro
    }

    // 3. Critério de desempate: a string mais curta
    return a.length - b.length;
  });

  const bestMatch = matches[0];
  return bestMatch ? images[bestMatch] : undefined;
};
