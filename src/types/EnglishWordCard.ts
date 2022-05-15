import type DefinitionWithPartOfSpeech from "@/types/DefinitionWithPartOfSpeech";
import type IWordMeta from "@/types/IWordMeta";
import type { Image } from "@/api/modules/AnkiConnect";

export default interface EnglishWordCard {
  word: string;
  image: Image | null;
  audioUrl: string | undefined;
  definitions: DefinitionWithPartOfSpeech[];
  meta: IWordMeta;
  normalizedLemmas: string[];
}
