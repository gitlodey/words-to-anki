import type PartOfSpeech from "@/components/word-card/PartOfSpeechList";
import type DictionaryApiError from "@/services/DictionaryApi/DictionaryApiError";

export type License = {
    name: string,
    url: string,
}

export type DictonaryApiPhonetic = {
    text: string,
    audio: string,
    sourceUrl: string,
    license: License,
}

export type DictonaryApiMeaning = {
    partOfSpeech: PartOfSpeech,
    definitions: DictonaryApiDefinition[],
    synonyms: string[],
    antonyms: string[],
}

export type DictonaryApiDefinition = {
    definition: string,
    example: string,
    synonyms: string[],
    antonyms: string[],
}

export type DictonaryApiResponse = {
    word: string,
    phonetic: string,
    phonetics: DictonaryApiPhonetic[],
    meanings: DictonaryApiMeaning[],
    license: License,
    sourceUrls: string[],
}

class Dictionaryapi {
    readonly url: string = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
    async getMeaning (word: string) {
        const response = await fetch(`${this.url}${word}`)
        const body: DictonaryApiResponse[] | DictionaryApiError = await response.json()

        if (response.ok && body instanceof Array) {
            return body[0];
        }

        throw body
    }
}

export default new Dictionaryapi()