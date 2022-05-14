import { defineStore } from "pinia";
import api from "@/api";
import type { WordWithMeaningsType } from "@/types/WordWithMeaningsType";

interface EnglishWordsStore {
  words: WordWithMeaningsType[];
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
        this.words.unshift({
          word: dictionaryApiResponse?.word,
          meaning: dictionaryApiResponse,
          linguaRobotResponse: linguaRobotResponse,
        });
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
    deleteWord(word: WordWithMeaningsType) {
      const index = this.words.indexOf(word);
      if (index > -1) {
        this.words.splice(index, 1);
      }
    },
  },
});
