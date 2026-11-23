export type AspectMean = {
  [aspect: string]: number | null;
}

// Calculates the average aspect scores for a feature based on an array of ratings and a list of keys relevant to the feature type.
export function aspectMeans(ratings: Record<string, number>[], aspectKeys: string[]) {
  const meanScores: AspectMean = {};
  
  aspectKeys.forEach(key => {
    const ratingScores = ratings.map(rating => rating[key]).filter(val => !isNaN(val));
    meanScores[key] = ratingScores.length > 0 ? ratingScores.reduce((acc, value) => acc + value, 0) / ratingScores.length : null;
  })

  return meanScores;
}

// Calculates the overall AccessScore for a feature based on provided mean scores, which can be calculated by aspectMeans, and the weights for each aspect.
export function accessScore(meanScores: AspectMean, aspects: {aspectKey: string, weight: number}[]) {
  let sum = 0;
  let currentWeight = 0;
  
  for (const {aspectKey, weight} of aspects) {
    const mean = meanScores[aspectKey];
    if (mean !== null && mean !== undefined && !isNaN(mean)) {
      sum += weight * mean;
      currentWeight += weight;
    }
  }

  if (currentWeight === 0) return null;

  return Math.round((sum / currentWeight) * 10) / 10;
}