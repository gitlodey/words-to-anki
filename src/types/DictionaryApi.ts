import type PartOfSpeech from "@/types/PartOfSpeechList";

export type License = {
  name: string;
  url: string;
};

export type DictionaryApiPhonetic = {
  text: string;
  audio: string;
  sourceUrl: string;
  license: License;
};

export type DictionaryApiMeaning = {
  partOfSpeech: PartOfSpeech;
  definitions: DictionaryApiDefinition[];
  synonyms: string[];
  antonyms: string[];
};

export type DictionaryApiDefinition = {
  definition: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
};

export type DictionaryApiResponse = {
  word: string;
  phonetic: string;
  phonetics: DictionaryApiPhonetic[];
  meanings: DictionaryApiMeaning[];
  license: License;
  sourceUrls: string[];
};
