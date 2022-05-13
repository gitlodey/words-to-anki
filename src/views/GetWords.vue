<template>
  <div>
    <input v-model="state.word">
    <button @click="handleInputSearch(state.word)">
      Find meaning for word
    </button>
    <textarea v-if="false" name="" id="" cols="30" rows="10" v-model="state.newWordsList" @input="handleTextareaSearch"></textarea>

    <div>
      <word-card v-for="item in state.wordWithMeanings" :key="item.word" :card="item"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from "vue";
  import Dictionaryapi from "@/services/DictionaryApi/dictionaryapi";
  import LocalJsonApi from "@/services/localJsonApi";
  import type {
    DictonaryApiResponse,
    DictonaryApiDefinition,
  } from "@/services/DictionaryApi/dictionaryapi";
  import type { LocalJsonWord } from "@/services/localJsonApi";
  import AnkiConnectApi from "@/services/anki-connect-api";
  import type { Audio } from "@/services/anki-connect-api";
  import WordCard from "@/components/word-card/WordCard.vue";
  import type {LinguaRobotResponse} from "@/services/linguaRobot/lingua-robot-types";

  type GetWords = {
    words: string[],
    newWordsList: string,
    word: string,
    wordWithMeanings: WordWithMeaningsType[],
    localWords: LocalJsonWord[],
    total: string,
  }

  export type WordWithMeaningsType = {
    word: string,
    meaning: DictonaryApiResponse,
    linguaRobotResponse?: LinguaRobotResponse,
  }

  let state: GetWords = reactive({
    words: [],
    newWordsList: '',
    word: '',
    wordWithMeanings: [],
    localWords: [],
    total: '',
  });

  const handleTextareaSearch = async (e: InputEvent) => {
    const words = getWordsFromTextarea(e);
    await addNewWords(words);
  }

  const serializeLocalJsonToDictonaryApi = (meaning: LocalJsonWord | undefined): DictonaryApiDefinition[] =>{

    if (!meaning) {
      return [];
    }

    let result: DictonaryApiDefinition[] = []

    if (meaning.longDefinition) {
      result.push({
        definition: meaning.longDefinition,
        example: '',
        synonyms: [],
        antonyms: [],
      })
    }
    if (meaning.shortDefinition) {
      result.push({
        definition: meaning.shortDefinition,
        example: '',
        synonyms: [],
        antonyms: [],
      })
    }
    if (meaning.secondDefinitions.length) {
      meaning.secondDefinitions.map(item => {
        result.push({
          definition: item.definition,
          example: '',
          synonyms: [],
          antonyms: [],
        })
      })
    }

    return result;
  }

  const handleInputSearch = async (word: string) => {

    const preparedWord = word.trim().toLowerCase();

    const meaningFromDictonaryApi = await findMeaning(preparedWord) as DictonaryApiResponse;
    const meaningFromLocalJson = await findMeaningInLocalJson(preparedWord) as LocalJsonWord;
    const serializedDefinitions = serializeLocalJsonToDictonaryApi(meaningFromLocalJson);

    meaningFromDictonaryApi.meanings.unshift({
      definitions: serializedDefinitions,
      antonyms: [],
      synonyms: [],
      partOfSpeech: '',
    })

    const definitionFormattedForAnki = formatDefinitionsForAnki(meaningFromDictonaryApi);

    await addNewWord(meaningFromDictonaryApi, definitionFormattedForAnki);
  }

  const getWordsFromTextarea = (e: InputEvent): string[] => {
    const textarea = e.target as HTMLTextAreaElement
    const newWords: string[] = textarea.value.split(/\n/);
    return newWords || [];
  };

  const formatDefinitionsForAnki = (meaning: DictonaryApiResponse): string => {
    let totalDefinition = "";

    totalDefinition += `<h1>${meaning.word}</h1>`

    meaning.phonetics.map((phonetic, index, array) => {
      if (phonetic.text) {
        totalDefinition += `<i>${phonetic.text}</i><br/>`
      }

      if (index > 0 && array.length === index) {
        totalDefinition += `<br/>`
      }
    })

    meaning.meanings.map(item => {
      item.definitions.map(definition => {
        totalDefinition += `<b>Definition:</b> <span>${definition.definition}</span>`
        if (definition.example) {
          totalDefinition += `<br/><b>Example:</b> <span>${definition.example}</span><br/><br/>`
        } else {
          totalDefinition += `<br/><br/>`
        }
      })
    })

    return totalDefinition;
  };

  const addNewWord = async (meaning: DictonaryApiResponse, formattedDefinition: string) => {
    let audioUrl = '';

    meaning.phonetics.map(item => {
      if (item.audio) {
        audioUrl = item.audio
      }
    })

    const audio: Audio | undefined = audioUrl ? {
      url: audioUrl,
      filename: audioUrl.split('/').pop() || '',
      fields: [
        'Front'
      ]
    } : undefined;

    await AnkiConnectApi.addWord({
      word: meaning.word,
      shortDefinition: formattedDefinition,
    }, audio);

    state.wordWithMeanings.push({
      word: meaning.word,
      meaning,
    })
  }

  const addNewWords = async (words: string[]) => {
    words.map(async word => {
      const preparedWord = word.trim().toLowerCase();
      const meaning = await findMeaning(preparedWord) as DictonaryApiResponse;
      //addNewWord()
    })

    state.newWordsList = ''
  }

  const findMeaning = async (word: string) => await Dictionaryapi.getMeaning(word);
  const findMeaningInLocalJson = async (word: string) => await LocalJsonApi.getMeaning(word);

</script>
