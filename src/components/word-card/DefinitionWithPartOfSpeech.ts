import type { DictonaryApiDefinition } from "@/services/dictionaryapi";

export default interface DefinitionWithPartOfSpeech extends DictonaryApiDefinition {
    partOfSpeech: string,
    include: boolean,
}