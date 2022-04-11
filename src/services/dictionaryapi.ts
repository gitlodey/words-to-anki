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
    partOfSpeech: string,
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
        try {
            const response = await fetch(`${this.url}${word}`)
            const body: DictonaryApiResponse[] = await response.json()

            return body[0];

        } catch (e) {
            return {}
        }
    }
}

export default new Dictionaryapi()