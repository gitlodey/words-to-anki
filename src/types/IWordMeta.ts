import type { DictionaryApiPhonetic } from "@/types/DictionaryApi";

export default interface IWordMeta {
  phonetic: string;
  phonetics: DictionaryApiPhonetic[];
  synonyms: string[];
  antonyms: string[];
  partOfSpeech: string[];
}
