<template>
  <div>
    <h1>Add new English Words to your Anki</h1>
    
    <div class="input-selector">
      <input
          type="radio"
          :value="InputTypes.one"
          name="type"
          v-model="selectedInputType"
      />
      <input
          type="radio"
          :value="InputTypes.list"
          name="type"
          v-model="selectedInputType"
      />

    </div>

    <add-new-words
        :is-single-word-form="isSingleWordFormShow"
        @addWord="handleAddWordsForm"
    />

    <h2 v-if="words.length > 1">Words list</h2>
    <word-card v-for="item in words" :key="item.word" :card="item"/>
  </div>
</template>

<script lang="ts" setup>

import {computed, reactive, ref} from "vue";
import Dictionaryapi from "@/services/dictionaryapi";
import type { DictonaryApiResponse } from "@/services/dictionaryapi";
import type {WordWithMeaningsType} from "@/views/GetWords.vue";
import WordCard from "@/components/WordCard.vue";
import AddNewWords from "@/components/add-new-words/AddNewWords.vue";

enum InputTypes {
  one =  'one',
  list = 'list',
}

//data
let selectedInputType = ref<InputTypes>(InputTypes.one)
let words = reactive<WordWithMeaningsType[]>([])

//computed
let isSingleWordFormShow = computed(() => {
  switch (selectedInputType.value) {
    case InputTypes.one:
      return true;
    case InputTypes.list:
      return false;
    default:
      return false;
  }
})

//methods
const handleAddWordsForm = async (word: string) => {
  const preparedWord = word.trim().toLowerCase();
  const meaning = await findMeaning(preparedWord) as DictonaryApiResponse;
  addNewWord(meaning)
}
const addNewWord = (meaning: DictonaryApiResponse) => {
  words.unshift({
    word: meaning.word,
    meaning,
  })
}
const findMeaning = async (word: string) => await Dictionaryapi.getMeaning(word);
</script>
