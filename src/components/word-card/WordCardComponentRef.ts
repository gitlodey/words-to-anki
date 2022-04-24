import type { Image } from "@/services/anki-connect-api";

interface WordCardComponentRef {
    wordStr: string
    getImageData(): Image | null
    formatDefinitionsForAnki(): string
    getAudioForAnki(): string | undefined
}

export default WordCardComponentRef
