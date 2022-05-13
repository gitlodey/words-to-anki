import type { DictionaryApiResponse } from "@/types/DictionaryApi";
import type { LinguaRobotResponse } from "@/types/lingua-robot-types";

export type WordWithMeaningsType = {
  word: string;
  meaning: DictionaryApiResponse;
  linguaRobotResponse?: LinguaRobotResponse;
};
