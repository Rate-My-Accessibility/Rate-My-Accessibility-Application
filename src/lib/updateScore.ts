import { prisma } from "./prisma";
import { aspectMeans, accessScore } from "@/lib/scoring";

// Updates a feature's average aspect scores and final access score based on its review ratings
const updateFeatureScore = async (featureId: number) => {
  const feature = await prisma.feature.findUnique({
    where: { id: featureId }
  })

  if (!feature) throw new Error(`Feature #${featureId} was not found.`)

  const reviews = await prisma.review.findMany({ where: { featureId }})
  const aspects = await prisma.featureAspect.findMany({ where: { type: feature.type } })
  const means = aspectMeans(reviews.map(review => review.scores as Record<string, number>), aspects.map(aspect => aspect.aspectKey));

  await prisma.feature.update({
    where: { id: featureId },
    data: {
      scoreAverages: means,
      accessScore: accessScore(means, aspects) || 0, // TODO: Handle null case better? For now, 0 is simply an illegal AccessScore value that maps to N/A in the card.
    }
  })
}

export default updateFeatureScore;