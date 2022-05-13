import type { DictionaryApiDefinition } from "@/api/DictionaryApi";
import type PartOfSpeech from "@/types/PartOfSpeechList";

export default interface DefinitionWithPartOfSpeech
  extends DictionaryApiDefinition {
  partOfSpeech: PartOfSpeech;
  include: boolean;
}
