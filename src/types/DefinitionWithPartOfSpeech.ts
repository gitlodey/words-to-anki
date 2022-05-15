import type PartOfSpeech from "@/types/PartOfSpeechList";
import type { DictionaryApiDefinition } from "@/types/DictionaryApi";

export default interface DefinitionWithPartOfSpeech
  extends DictionaryApiDefinition {
  partOfSpeech: PartOfSpeech;
  include: boolean;
}
