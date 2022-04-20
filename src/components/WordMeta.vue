<template>
  <div>
    <template v-for="phonetic in phonetics" :key="phonetic.text">
      <audio v-if="phonetic.audio" controls :src="phonetic.audio">Play</audio>
    </template>

    <blockquote>{{phonetic}}</blockquote>

    <b>Part of speech: {{partOfSpeechStr}}</b>

    <p v-if="synonyms.length">
      Synonyms: {{synonymsStr}}
    </p>
    <p v-if="antonyms.length">
      Antonyms: {{antonymsStr}}
    </p>
  </div>
</template>

<script setup lang="ts">
import type {DictonaryApiPhonetic} from "@/services/dictionaryapi";
import {computed} from "vue";

//props
const props = defineProps<{
  phonetics: DictonaryApiPhonetic[],
  phonetic: string,
  synonyms: string[],
  antonyms: string[],
  partOfSpeech: string[],
}>()

//computed
const synonymsStr = computed(() => {
  return prepareArray(props.synonyms)
})

const antonymsStr = computed(() => {
  return prepareArray(props.antonyms)
})

const partOfSpeechStr = computed(() => {
  return prepareArray(props.partOfSpeech)
})

//methods
const prepareArray = (array: string[]): string => {
  return array.filter(item => item !== '').join(', ')
}
</script>
