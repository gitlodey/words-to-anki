interface WordCardComponentRef {
    wordStr: string,
    formatDefinitionsForAnki(): string
    getAudioForAnki(): string | undefined
}

export default WordCardComponentRef
