<template>
  <div>
    <h1>Add new English Words to your Anki</h1>
    <button @click="globalToggle">{{globalToggleText}}</button>

    
    <div class="input-selector">
      <label for="one">
        <input
            id="one"
            type="radio"
            :value="InputTypes.one"
            name="type"
            v-model="selectedInputType"
        />
        <span>Word</span>
      </label>
      <label for="list">
        <input
            id="list"
            type="radio"
            :value="InputTypes.list"
            name="type"
            v-model="selectedInputType"
        />
        <span>Words list</span>
      </label>

    </div>

    <add-new-words
        :is-single-word-form="isSingleWordFormShow"
        @addWord="handleAddWordsForm"
    />

    <h2 v-if="words.length > 1">Words list</h2>
    <expansion-panel-list
        :all-panels-open="allPanelsOpen"
    >
      <template #panels="{ allPanelsOpen }" >
        <expansion-panel
            v-for="word in words"
            :open="allPanelsOpen"
            :key="word.word"
        >
          <template #head>
            <b>{{word.word}}: </b>
            <span>{{word.meaning.meanings[0].definitions[0].definition}}</span>
          </template>
          <template #body>
            <word-card
                :ref="addWordCardRef"
                :card="word"
            />
          </template>
        </expansion-panel>
      </template>
    </expansion-panel-list>

    <button @click="saveWordsToAnki">try</button>
  </div>
</template>

<script lang="ts" setup>

import {computed, reactive, ref} from "vue";
import Dictionaryapi from "@/services/dictionaryapi";
import type { DictonaryApiResponse } from "@/services/dictionaryapi";
import type {WordWithMeaningsType} from "@/views/GetWords.vue";
import WordCard from "@/components/word-card/WordCard.vue";
import AddNewWords from "@/components/add-new-words/AddNewWords.vue";
import type WordCardComponentRef from '@/components/word-card/WordCardComponentRef';
import ExpansionPanelList from "@/components/expansion-panel/ExpansionPanelList.vue";
import ExpansionPanel from '@/components/expansion-panel/ExpansionPanel.vue';

enum InputTypes {
  one =  'one',
  list = 'list',
}

//data
const wordCardInstances = ref<WordCardComponentRef[] | null>([])
let selectedInputType = ref<InputTypes>(InputTypes.one)
let allPanelsOpen = ref<boolean>(true)
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
let globalToggleText = computed(() => allPanelsOpen.value ? 'Close all' : 'Open all')

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
const saveWordsToAnki = () => {
  wordCardInstances?.value?.forEach(wordCard => {
    console.log(wordCard.formatDefinitionsForAnki())
  })
}

const globalToggle = () => allPanelsOpen.value = !allPanelsOpen.value

function addWordCardRef(el: WordCardComponentRef) {
  if (el && 'formatDefinitionsForAnki' in el) {
    if (wordCardInstances?.value?.includes(el) === false) {
      wordCardInstances.value.push(el)
    }
  }
}
</script>
