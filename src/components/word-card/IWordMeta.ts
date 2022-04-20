import type { DictonaryApiPhonetic } from "@/services/dictionaryapi";

export default interface IWordMeta {
    phonetic: string,
    phonetics: DictonaryApiPhonetic[],
    synonyms: string[],
    antonyms: string[],
    partOfSpeech: string[],
}