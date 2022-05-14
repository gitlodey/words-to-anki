<template>
  <div class="word-meta">
    <template
      v-for="phonetic in phonetics"
      :key="phonetic.text"
    >
      <audio
        class="word-meta--item"
        v-if="phonetic.audio"
        controls
        :src="phonetic.audio"
      >
        Play
      </audio>
    </template>

    <div class="word-meta--item word-meta--transcription">{{ phonetic }}</div>

    <div class="word-meta--item">Part of speech: {{ partOfSpeechStr }}</div>

    <div
      class="word-meta--item"
      v-if="synonyms.length"
    >
      Synonyms: {{ synonymsStr }}
    </div>
    <div v-if="antonyms.length">Antonyms: {{ antonymsStr }}</div>
    <v-divider />
  </div>
</template>

<script
  setup
  lang="ts"
>
import type { DictionaryApiPhonetic } from "@/types/DictionaryApi";
import { computed } from "vue";

//props
const props = defineProps<{
  phonetics: DictionaryApiPhonetic[];
  phonetic: string;
  synonyms: string[];
  antonyms: string[];
  partOfSpeech: string[];
}>();

//computed
const synonymsStr = computed(() => {
  return prepareArray(props.synonyms);
});

const antonymsStr = computed(() => {
  return prepareArray(props.antonyms);
});

const partOfSpeechStr = computed(() => {
  return prepareArray(props.partOfSpeech);
});

//methods
const prepareArray = (array: string[]): string => {
  return array.filter((item) => item !== "").join(", ");
};
</script>

<style
  lang="scss"
  scoped
>
.word-meta {
  margin-bottom: 20px;

  &--item {
    margin-bottom: 10px;
  }

  &--transcription {
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
