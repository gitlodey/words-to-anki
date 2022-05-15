import { usePrepareEnglishMetaAndDefinitions } from "@/composables/usePrepareEnglishMetaAndDefinitions";
import { usePrepareNormalizedLemmas } from "@/composables/usePrepareNormalizedLemmas";
import type EnglishWordCard from "@/types/EnglishWordCard";
import type { LinguaRobotResponse } from "@/types/LinguaRobot";
import type { DictionaryApiResponse } from "@/types/DictionaryApi";

export const usePrepareEnglishCard = (
  dictionaryApiResponse: DictionaryApiResponse,
  linguaRobotResponse: LinguaRobotResponse
) => {
  const { meta, definitions } = usePrepareEnglishMetaAndDefinitions(
    dictionaryApiResponse
  );

  const { normalizedLemmas } = usePrepareNormalizedLemmas(
    linguaRobotResponse,
    dictionaryApiResponse.word
  );

  const audioUrl = meta.phonetics.find((item) => item.audio)?.audio;

  const englishWordCard: EnglishWordCard = {
    word: dictionaryApiResponse.word,
    image: null,
    audioUrl,
    meta,
    definitions,
    normalizedLemmas,
  };

  return { englishWordCard };
};
