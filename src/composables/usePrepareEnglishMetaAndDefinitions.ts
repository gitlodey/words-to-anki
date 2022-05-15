import type IWordMeta from "@/types/IWordMeta";
import type { DictionaryApiResponse } from "@/types/DictionaryApi";
import type DefinitionWithPartOfSpeech from "@/types/DefinitionWithPartOfSpeech";

export const usePrepareEnglishMetaAndDefinitions = (
  dictionaryApiResponse: DictionaryApiResponse
) => {
  const { meta, definitions } = dictionaryApiResponse.meanings.reduce(
    (
      acc: { meta: IWordMeta; definitions: DefinitionWithPartOfSpeech[] },
      meaning
    ) => {
      acc.meta.synonyms.push(...meaning.synonyms);
      acc.meta.antonyms.push(...meaning.antonyms);
      acc.meta.partOfSpeech.push(meaning.partOfSpeech);

      const preparedDefinitions = meaning.definitions.map(
        (definition): DefinitionWithPartOfSpeech => {
          return {
            ...definition,
            partOfSpeech: meaning.partOfSpeech,
            include: true,
          };
        }
      );

      acc.definitions.push(...preparedDefinitions);

      return acc;
    },
    {
      meta: {
        phonetic: dictionaryApiResponse.phonetic,
        phonetics: dictionaryApiResponse.phonetics,
        synonyms: [],
        antonyms: [],
        partOfSpeech: [],
      },
      definitions: [],
    }
  );

  return { meta, definitions };
};
