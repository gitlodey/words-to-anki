<template>
  <div>
    <h1>Add new English Words to your Anki</h1>

    <v-tabs v-model="selectedInputType" class="input-selector">
      <v-tab :value="InputTypes.one">{{InputTypes.one}}</v-tab>
      <v-tab :value="InputTypes.list">{{InputTypes.list}}</v-tab>
    </v-tabs>

    <add-new-words
        :is-single-word-form="isSingleWordFormShow"
        @addWord="handleAddWordsForm"
    />

    <h2 v-if="words.length > 1" class="mb20">Words list</h2>

    <v-btn
        v-if="words.length > 0"
        class="mb20"
        @click="globalToggle"
    >
      {{globalToggleText}}
    </v-btn>

    <expansion-panel
        v-for="word in words"
        :open="allPanelsOpen"
        :key="word.word"
    >
      <template #head>
        <b class="mr10">{{word.word}}:</b>
        <span>{{word.meaning.meanings[0].definitions[0].definition}}</span>
      </template>
      <template #body>
        <word-card
            :ref="addWordCardRef"
            :card="word"
            @findNewWord="handleAddWordsForm"
        />
      </template>
    </expansion-panel>

    <div class="button-container">
      <v-btn v-if="words.length" @click="saveWordsToAnki" color="success">
        Save to anki
      </v-btn>
    </div>

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
import ankiConnectApi from "@/services/anki-connect-api";
import LinguaRobotApi from "@/services/linguaRobot/lingua-robot-api";
import type {LinguaRobotResponse} from "@/services/linguaRobot/lingua-robot-types";
import ExpansionPanel from "@/components/expansion-panel/ExpansionPanel.vue";

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
  const { dictionaryApiResponse, linguaRobotResponse } = await findMeaning(preparedWord);
  addNewWord(dictionaryApiResponse, linguaRobotResponse)
}
const addNewWord = (dictionaryApiResponse: DictonaryApiResponse, linguaRobotResponse: LinguaRobotResponse) => {
  words.unshift({
    word: dictionaryApiResponse.word,
    meaning: dictionaryApiResponse,
    linguaRobotResponse: linguaRobotResponse,
  })
}
const findMeaning = async (word: string) => {
  const dictionaryApiResponse = await Dictionaryapi.getMeaning(word) as DictonaryApiResponse
  const linguaRobotResponse = await LinguaRobotApi.getWord(word)

  return {
    dictionaryApiResponse,
    linguaRobotResponse,
  }
};
const saveWordsToAnki = () => {
  wordCardInstances?.value?.forEach(wordCard => {
    console.log(wordCard.getImageData())
    ankiConnectApi.addWord({
        word: wordCard.wordStr,
        shortDefinition: wordCard.formatDefinitionsForAnki(),
      },
        wordCard.getAudioForAnki(),
        wordCard.getImageData(),
    )
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

<style lang="scss" scoped>
.input-selector {
  margin-bottom: 30px;
}
.word-card-list {
  margin-bottom: 30px;
}
</style>