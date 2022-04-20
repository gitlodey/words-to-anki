<template>
  <div class="word-card">
    {{card.word}}
     <word-meta :phonetic="phonetic" :phonetics="card.meaning.phonetics" :antonyms="antonyms" :synonyms="synonyms" :part-of-speech="partOfSpeech"/>
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
import {computed, reactive, ref} from "vue";
import type {WordWithMeaningsType} from "@/views/GetWords.vue";
import type {DictonaryApiDefinition} from "@/services/dictionaryapi";
import WordMeta from "@/components/WordMeta.vue";
import WordDefinition from "@/components/WordDefinition.vue";

const state = reactive<{
  newDefinitions: DefinitionWithPartOfSpeech[],
}>({
  newDefinitions: [],
})

let newDefinition = ref('')
let newExample = ref('')

const props = defineProps<{
  card: WordWithMeaningsType,
}>()

const phonetic = computed(() => {
  return props.card.meaning.phonetic
})

export interface DefinitionWithPartOfSpeech extends DictonaryApiDefinition {
  partOfSpeech: string,
  include: boolean,
}

const definitions = computed(() => {
  return props.card.meaning.meanings.reduce((acc: DefinitionWithPartOfSpeech[], meaning) => {
    const preparedDefinitions = meaning.definitions.map((d: DictonaryApiDefinition): DefinitionWithPartOfSpeech => {
      const dd = d as DefinitionWithPartOfSpeech
      dd.partOfSpeech = meaning.partOfSpeech;
      dd.include = true;
      return dd;
    })
    acc.push(...preparedDefinitions)
    return acc
  }, [])
})

const synonyms = computed(() => {
  return props.card.meaning.meanings
      .map(meaning => {
        return meaning.synonyms
      }).flat().join(', ')
})

const antonyms = computed(() => {
  return props.card.meaning.meanings
      .map(meaning => {
        return meaning.antonyms
      }).flat().join(', ')
})

const partOfSpeech = computed(() => props.card.meaning.meanings.map(meaning => meaning.partOfSpeech).join(', '))

const toggleInclude = (event, definition) => {
  definition.include = event
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