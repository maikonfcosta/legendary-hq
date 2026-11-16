import imageDB from '../data/imageDB.json';
import cardsDB from '../data/cards.json';

const images = imageDB as Record<string, string>;
const precomputedKeys = Object.keys(images).map(key => ({
  key,
  normalized: key.toLowerCase().replace(/[^a-z0-9]/g, '')
}));

const imageCache = new Map<string, string | undefined>();

export const getBystanderImage = (): string | undefined => {
  return images["Core Bystander.jpg"] || undefined;
};

export const getCardImage = (cardName: string, category: 'mastermind' | 'scheme' | 'hero' | 'villain' | 'henchmen', expansion?: string): string | undefined => {
  const cacheKey = `${category}_${cardName}_${expansion || ''}`.toLowerCase();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const search = cardName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Encontrar todas as chaves que contêm o nome
  const matches = precomputedKeys.filter(item => item.normalized.includes(search));

  if (matches.length > 0) {
    // Ordenar as correspondências para pegar a melhor imagem
    matches.sort((itemA, itemB) => {
      const normA = itemA.normalized;
      const normB = itemB.normalized;
      
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
      return itemA.key.length - itemB.key.length;
    });

    const bestMatch = matches[0];
    if (bestMatch && images[bestMatch.key]) {
      const result = images[bestMatch.key];
      imageCache.set(cacheKey, result);
      return result;
    }
  }

  // FALLBACK: Se não achar a imagem exata da carta, retorna a imagem DA CAIXA da expansão
  if (expansion) {
    const expObj = cardsDB.expansions.find((e: any) => e.id === expansion);
    if (expObj && expObj.image) {
      if (images[expObj.image]) {
        const result = images[expObj.image];
        imageCache.set(cacheKey, result);
        return result;
      }
    }
  }

  imageCache.set(cacheKey, undefined);
  return undefined;
};
