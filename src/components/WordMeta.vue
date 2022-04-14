<template>
  <div>
    <template v-for="phonetic in phonetics" :key="phonetic.text">
      <audio v-if="phonetic.audio" controls :src="phonetic.audio">Play</audio>
    </template>

    <blockquote>{{phonetic}}</blockquote>

    <b>{{partOfSpeech}}</b>

    <p v-if="synonyms.length">
      Synonyms: {{synonyms}}
    </p>
    <p v-if="antonyms.length">
      Antonyms: {{antonyms}}
    </p>
  </div>
</template>

<script setup lang="ts">
import type {DictonaryApiPhonetic} from "@/services/dictionaryapi";

defineProps<{
  phonetics: DictonaryApiPhonetic[],
  phonetic: string,
  synonyms: string[],
  antonyms: string[],
  partOfSpeech: string[],
}>()
</script>

<style scoped>

</style>