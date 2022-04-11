<template>
  <div>
    <input v-model="state.word">
    <button @click="handleInputSearch(state.word)">
      Find meaning for word
    </button>
    <textarea name="" id="" cols="30" rows="10" v-model="state.newWordsList" @input="handleTextareaSearch"></textarea>



    <ul>
      <li v-for="item in state.wordWithMeanings" :key="item.word">
        <p>
          {{item.word}}
          <template v-for="phonetic in item.meaning.phonetics" :key="phonetic.text">
            <audio v-if="phonetic.audio" controls :src="phonetic.audio">Play</audio>
          </template>
        </p>
        <div v-for="wordMeaning in item.meaning.meanings" :key="wordMeaning.partOfSpeech">
          <b>{{wordMeaning.partOfSpeech}}</b>
          <p v-for="definition in wordMeaning.definitions" :key="definition.definition">
            Definition: {{definition.definition}}
            <br>
            <span v-if="definition.example">
              Example: {{definition.example}}
            </span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from "vue";
  import Dictionaryapi from "@/services/dictionaryapi";
  import type { DictonaryApiResponse } from "@/services/dictionaryapi";

  type GetWords = {
    words: string[],
    newWordsList: string,
    word: string,
    wordWithMeanings: WordWithMeaningsType[],
  }

  type WordWithMeaningsType = {
    word: string,
    meaning: DictonaryApiResponse,
  }

  let state: GetWords = reactive({
    words: [],
    newWordsList: '',
    word: '',
    wordWithMeanings: [],
  });

  const handleTextareaSearch = async (e: InputEvent) => {
    const words = getWordsFromTextarea(e);
    await addNewWords(words);
  }

  const handleInputSearch = async (word: string) => {
    await addNewWords([word]);
  }

  const getWordsFromTextarea = (e: InputEvent): string[] => {
    const textarea = e.target as HTMLTextAreaElement
    const newWords: string[] = textarea.value.split(/\n/);
    return newWords || [];
  };

  const addNewWords = async (words: string[]) => {
    words.map(async word => {
      const preparedWord = word.trim().toLowerCase();
      const meaning = await findMeaning(preparedWord) as DictonaryApiResponse;
      if (preparedWord.length) {

        state.wordWithMeanings.push({
          word,
          meaning,
        })
      }
    })

    state.newWordsList = ''
  }

  const findMeaning = async (word: string) => await Dictionaryapi.getMeaning(word);

</script>
