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

    <button
        v-if="state.addDefinitionEnabled === false"
        @click="addDefinitionFormToggle"
    >
      add your definition
    </button>

    <div
        class="new-definition-form"
        v-if="state.addDefinitionEnabled"
    >
      <input type="text" v-model="newDefinition">
      <input type="text" v-model="newExample">
      <select v-model="newPartOfSpeech">
        <option value=""></option>
        <option v-for="item in PartOfSpeechList" :key="item">{{item}}</option>
      </select>

      <button @click="addDefinition">add</button>
      <button @click="cancelNewDefinition">cancel</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import type { WordWithMeaningsType } from "@/views/GetWords.vue";
import type DefinitionWithPartOfSpeech from './DefinitionWithPartOfSpeech'
import type IWordMeta from './IWordMeta';
import WordMeta from "@/components/WordMeta.vue";
import WordDefinition from "@/components/WordDefinition.vue";
import type PartOfSpeech from './PartOfSpeechList';
import { PartOfSpeechList } from './PartOfSpeechList';

//props
const props = defineProps<{
  card: WordWithMeaningsType,
}>()

//data
const state = reactive<{
  newDefinitions: DefinitionWithPartOfSpeech[],
  addDefinitionEnabled: boolean,
}>({
  newDefinitions: [],
  addDefinitionEnabled: false,
})

let newDefinition = ref('')
let newExample = ref('')
let newPartOfSpeech = ref<PartOfSpeech>('')

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
    partOfSpeech: newPartOfSpeech.value,
    include: true,
    synonyms: [],
    antonyms: [],
  })

  newDefinition.value = '';
  newExample.value = '';
}
const cancelNewDefinition = () => {
  newDefinition.value = ''
  newExample.value = ''
  newPartOfSpeech.value = ''
  addDefinitionFormToggle()
}
const addDefinitionFormToggle = () => state.addDefinitionEnabled = !state.addDefinitionEnabled
</script>

<style scoped>
.word-card {
  background-color: #efefef;
  padding: 20px;
  margin-bottom: 20px;
}
</style>