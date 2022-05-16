import type DefinitionWithPartOfSpeech from "@/types/DefinitionWithPartOfSpeech";
import type IWordMeta from "@/types/IWordMeta";
import type AnkiCardImage from "@/types/AnkiCardImage";

export default interface EnglishWordCard {
  word: string;
  image: AnkiCardImage | null;
  audioUrl: string | undefined;
  definitions: DefinitionWithPartOfSpeech[];
  meta: IWordMeta;
  normalizedLemmas: string[];
}
