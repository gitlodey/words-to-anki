import type EnglishWordCard from "@/types/EnglishWordCard";

export const useFormatTextForAnki = (wordCard: EnglishWordCard) => {
  let ankiCardContent = "";

  ankiCardContent += `<h1>${wordCard.word}</h1>`;
  wordCard.meta.phonetics.map((phonetic, index, array) => {
    if (phonetic.text) {
      ankiCardContent += `<i>${phonetic.text}</i><br/>`;
    }

    if (index > 0 && array.length === index) {
      ankiCardContent += `<br/>`;
    }
  });
  if (wordCard.meta.partOfSpeech.length > 0) {
    ankiCardContent += `Part of speech: <p>${wordCard.meta.partOfSpeech.join(
      ", "
    )}</p>`;
  }
  if (wordCard.meta.synonyms.length > 0) {
    ankiCardContent += `Synonims: <p>${wordCard.meta.synonyms.join(", ")}</p>`;
  }
  if (wordCard.meta.antonyms.length > 0) {
    ankiCardContent += `Antonyms: <p>${wordCard.meta.antonyms.join(", ")}</p>`;
  }
  wordCard.definitions.map((definition) => {
    if (definition.include) {
      ankiCardContent += `<b>Definition${
        definition.partOfSpeech ? " (" + definition.partOfSpeech + ")" : ""
      }:</b> <span>${definition.definition}</span>`;
      if (definition.example) {
        ankiCardContent += `<br/><b>Example:</b> <span>${definition.example}</span><br/><br/>`;
      } else {
        ankiCardContent += `<br/><br/>`;
      }
    }
  });

  return { ankiCardContent };
};
