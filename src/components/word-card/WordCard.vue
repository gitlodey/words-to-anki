<template>
  <div class="word-card">
    {{card.word}}
     <word-meta
         :phonetic="wordMeta.phonetic"
         :phonetics="wordMeta.phonetics"
         :antonyms="wordMeta.antonyms"
         :synonyms="wordMeta.synonyms"
         :part-of-speech="wordMeta.partOfSpeech"
     />
    <word-definition
        v-for="definition in state.newDefinitions"
        :key="definition.definition"
        :definition="definition"
        @toggleInclude="toggleInclude($event, definition)"
    />
    <word-definition
        v-for="definition in definitions"
        :key="definition.definition"
        :definition="definition"
        @toggleInclude="toggleInclude($event, definition)"
    />

    <button @click="addDefinition">add definition</button>

    <input type="text" v-model="newDefinition">
    <input type="text" v-model="newExample">
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import type { WordWithMeaningsType } from "@/views/GetWords.vue";
import type DefinitionWithPartOfSpeech from './DefinitionWithPartOfSpeech'
import type IWordMeta from './IWordMeta';
import WordMeta from "@/components/WordMeta.vue";
import WordDefinition from "@/components/WordDefinition.vue";

//props
const props = defineProps<{
  card: WordWithMeaningsType,
}>()

//data
const state = reactive<{
  newDefinitions: DefinitionWithPartOfSpeech[],
}>({
  newDefinitions: [],
})

let newDefinition = ref('')
let newExample = ref('')

//computed
const definitions = computed(() => {
  return props.card.meaning.meanings.reduce((acc: DefinitionWithPartOfSpeech[], meaning) => {
    const preparedDefinitions = meaning.definitions.map((definition): DefinitionWithPartOfSpeech => {
      return {
        ...definition,
        partOfSpeech: meaning.partOfSpeech,
        include: true,
      };
    })
    acc.push(...preparedDefinitions)
    return acc
  }, [])
})
const wordMeta = computed<IWordMeta>(() => {
  return props.card.meaning.meanings.reduce((acc: IWordMeta, meaning) => {
    acc.synonyms.push(...meaning.synonyms)
    acc.antonyms.push(...meaning.antonyms)
    acc.partOfSpeech.push(meaning.partOfSpeech)

    return acc
  }, {
    phonetic: props.card.meaning.phonetic,
    phonetics: props.card.meaning.phonetics,
    synonyms: [],
    antonyms: [],
    partOfSpeech: [],
  })
})

//methods
const toggleInclude = (include: boolean, definition: DefinitionWithPartOfSpeech) => {
  definition.include = include
}
const addDefinition = () => {
  state.newDefinitions.push({
    definition: newDefinition.value,
    example: newExample.value,
    partOfSpeech: '',
    include: true,
    synonyms: [],
    antonyms: [],
  })

  newDefinition.value = '';
  newExample.value = '';
}
</script>

<style scoped>
.word-card {
  background-color: #efefef;
  padding: 20px;
  margin-bottom: 20px;
}
</style>