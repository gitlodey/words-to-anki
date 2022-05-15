import type { LinguaRobotResponse } from "@/types/LinguaRobot";

export const usePrepareNormalizedLemmas = (
  linguaRobotResponse: LinguaRobotResponse,
  originWord: string,
) => {
  const normalizedLemmasRaw = linguaRobotResponse.entries
    .map((entry) => entry.interpretations)
    .flat()
    .map((interpretation) => interpretation.normalizedLemmas)
    .flat()
    .map((lemma) => lemma.lemma)
    .filter((lemma) => lemma !== originWord);
  const normalizedLemmas = [...new Set(normalizedLemmasRaw)];

  return { normalizedLemmas };
};
