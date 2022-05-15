import api from "@/api";
import { defineStore } from "pinia";
import { usePrepareEnglishCard } from "@/composables/usePrepareEnglishCard";
import { useFormatTextForAnki } from "@/composables/useFormatTextForAnki";
import { useFormatImageForAnki } from "@/composables/useFormatImageForAnki";
import type EnglishWordCard from "@/types/EnglishWordCard";
import type DefinitionWithPartOfSpeech from "@/types/DefinitionWithPartOfSpeech";
import type { Image } from "@/api/modules/AnkiConnect";

interface EnglishWordsStore {
  words: EnglishWordCard[];
}

export const useEnglishWords = defineStore("EnglishWords", {
  state(): EnglishWordsStore {
    return {
      words: [],
    };
  },
  actions: {
    async getWord(word: string) {
      const { dictionaryApiResponse, linguaRobotResponse } =
        await this.findMeaning(word);

      if (dictionaryApiResponse && linguaRobotResponse) {
        const { englishWordCard } = usePrepareEnglishCard(
          dictionaryApiResponse,
          linguaRobotResponse,
        );

        this.words.unshift(englishWordCard);
      }
    },
    async findMeaning(word: string) {
      try {
        const dictionaryApiResponse = await api.dictionary.getMeaning(word);
        const linguaRobotResponse = await api.linguaRobot.getWord(word);

        return {
          dictionaryApiResponse,
          linguaRobotResponse,
        };
      } catch (e) {
        if (e instanceof Error) {
          alert(`${word}: ${e.message}`);
        }
        return {};
      }
    },
    deleteWord(word: EnglishWordCard) {
      const index = this.words.indexOf(word);
      if (index > -1) {
        this.words.splice(index, 1);
      }
    },
    updateWordImage(word: EnglishWordCard, image: Image | null) {
      this.words.map((item) => {
        if (item === word) {
          item.image = image;
        }
      });
    },
    addDefinitionToWord(
      word: EnglishWordCard,
      definition: DefinitionWithPartOfSpeech,
    ) {
      this.words.map((item) => {
        if (item === word) {
          item.definitions.unshift(definition);
        }
      });
    },
    updateDefinitionStatus(
      word: EnglishWordCard,
      definition: DefinitionWithPartOfSpeech,
      include: boolean,
    ) {
      this.words.map((item) => {
        if (item === word) {
          item.definitions?.map((i) => {
            if (i === definition) {
              i.include = include;
            }
          });
        }
      });
    },
    saveWordsToAnki() {
      this.words.map(async (word) => {
        const { ankiCardContent } = useFormatTextForAnki(word);
        const { ankiImage } = useFormatImageForAnki(word.image);
        await api.anki.addWord(
          {
            word: word.word,
            shortDefinition: ankiCardContent,
          },
          word.audioUrl,
          ankiImage,
        );
      });
    },
  },
});
