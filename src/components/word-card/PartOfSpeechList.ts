enum PartOfSpeechList {
  noun = "noun",
  pronoun = "pronoun",
  verb = "verb",
  adjective = "adjective",
  adverb = "adverb",
  preposition = "preposition",
  conjunction = "conjunction",
  interjection = "interjection",
}
type PartOfSpeech = PartOfSpeechList | "";

export default PartOfSpeech;

export { PartOfSpeechList };
