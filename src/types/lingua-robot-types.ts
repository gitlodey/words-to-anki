import type PartOfSpeech from "@/types/PartOfSpeechList";
import type { License } from "@/types/DictionaryApi";

export interface LinguaRobotResponse {
  entries: LinguaRobotEntry[];
}

export interface LinguaRobotEntry {
  entry: string;
  pronunciations: LinguaRobotPronunciation[];
  interpretations: LinguaRobotInterpretation[];
  lexemes: LinguaRobotLexeme[];
  license: License;
  sourceUrls: string[];
}

export interface LinguaRobotPronunciation {
  transcriptions: LinguaRobotTranscription[];
  audio?: LinguaRobotAudio;
  context: LinguaRobotContext;
}

export interface LinguaRobotTranscription {
  transcription: string;
  notation: string;
}

export interface LinguaRobotAudio {
  url: string;
  sourceUrl: string;
  license?: License;
}

export interface LinguaRobotContext {
  regions: string[];
}

export interface LinguaRobotInterpretation {
  lemma: string;
  normalizedLemmas: LinguaRobotLemma[];
  partOfSpeech: PartOfSpeech;
  grammar: LinguaRobotGrammar[];
}

export interface LinguaRobotLemma {
  lemma: string;
}

export interface LinguaRobotGrammar {
  number?: string[];
  case?: string[];
  person?: string[];
  verbForm?: string[];
  tense?: string[];
  mood?: string[];
  degree?: string[];
}

export interface LinguaRobotLexeme {
  lemma: string;
  partOfSpeech: PartOfSpeech;
  senses: LinguaRobotSense[];
  forms: LinguaRobotForm[];
  synonymSets?: LinguaRobotSynonym[];
  antonymSets?: LinguaRobotAntonym[];
}

export interface LinguaRobotSense {
  definition: string;
  usageExamples?: string[];
  labels?: string[];
}

export interface LinguaRobotForm {
  form: string;
  grammar: LinguaRobotGrammar[];
}

export interface LinguaRobotSynonym {
  sense: string;
  synonyms: string[];
}

export interface LinguaRobotAntonym {
  sense: string;
  antonyms: string[];
}
