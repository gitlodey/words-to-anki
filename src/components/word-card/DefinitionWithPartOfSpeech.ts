import type { DictonaryApiDefinition } from "@/services/dictionaryapi";
import type PartOfSpeech from "@/components/word-card/PartOfSpeechList";

export default interface DefinitionWithPartOfSpeech extends DictonaryApiDefinition {
    partOfSpeech: PartOfSpeech,
    include: boolean,
}