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
        v-for="definition in sortedDefinitions"
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
import { computed, reactive, ref, watch } from "vue";
import type { WordWithMeaningsType } from "@/views/GetWords.vue";
import type DefinitionWithPartOfSpeech from './DefinitionWithPartOfSpeech'
import type IWordMeta from './IWordMeta';
import WordMeta from "@/components/WordMeta.vue";
import WordDefinition from "@/components/WordDefinition.vue";
import type PartOfSpeech from './PartOfSpeechList';
import { PartOfSpeechList } from './PartOfSpeechList';
import type WordCardComponentRef from './WordCardComponentRef';

//props
const props = defineProps<{
  card: WordWithMeaningsType,
}>()

//data
const state = reactive<{
  definitions: DefinitionWithPartOfSpeech[],
  newDefinitions: DefinitionWithPartOfSpeech[],
  addDefinitionEnabled: boolean,
}>({
  definitions: [],
  newDefinitions: [],
  addDefinitionEnabled: false,
})

let newDefinition = ref('')
let newExample = ref('')
let newPartOfSpeech = ref<PartOfSpeech>('')

watch(
    props.card,
    (newCard) => {
      const clonedCard: WordWithMeaningsType = JSON.parse(JSON.stringify(newCard));
      state.definitions = clonedCard.meaning.meanings.reduce((acc: DefinitionWithPartOfSpeech[], meaning) => {
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
    },
    {
      deep: true,
      immediate: true,
    }
)

//computed
const sortedDefinitions = computed(() => {
  const clonedDefinitions = [...state.newDefinitions, ...state.definitions]
  return clonedDefinitions.sort((defA, defB) => {

    if (defA.include === true && defB.include === false) return -1
    if (defA.include === false && defB.include === true) return 1
    return 0
  })
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
const audioUrl = computed(() : string | undefined => props.card.meaning?.phonetics.find(item => item.audio)?.audio)
const wordStr = computed(() => props.card.word)

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
const formatDefinitionsForAnki = (): string => {
  let totalDefinition = '';

  totalDefinition += `<h1>${props.card.word}</h1>`
  props.card.meaning.phonetics.map((phonetic, index, array) => {
    if (phonetic.text) {
      totalDefinition += `<i>${phonetic.text}</i><br/>`
    }

    if (index > 0 && array.length === index) {
      totalDefinition += `<br/>`
    }
  })
  if (wordMeta.value.partOfSpeech.length > 0) {
    totalDefinition += `Part of speech: <p>${wordMeta.value.partOfSpeech.join(', ')}</p>`
  }
  if (wordMeta.value.synonyms.length > 0) {
    totalDefinition += `Synonims: <p>${wordMeta.value.synonyms.join(', ')}</p>`
  }
  if (wordMeta.value.antonyms.length > 0) {
    totalDefinition += `Antonyms: <p>${wordMeta.value.antonyms.join(', ')}</p>`
  }
  sortedDefinitions.value.map(definition => {
    if (definition.include) {
      totalDefinition += `<b>Definition${definition.partOfSpeech ? ' ('+definition.partOfSpeech+')' : ''}:</b> <span>${definition.definition}</span>`
      if (definition.example) {
        totalDefinition += `<br/><b>Example:</b> <span>${definition.example}</span><br/><br/>`
      } else {
        totalDefinition += `<br/><br/>`
      }
    }
  })

  return totalDefinition;
};
const getAudioForAnki = (): string | undefined => audioUrl.value

defineExpose<WordCardComponentRef>({
  formatDefinitionsForAnki,
  getAudioForAnki,
  wordStr: wordStr.value,
})
</script>

<style scoped>
.word-card {
  background-color: #efefef;
  padding: 20px;
  margin-bottom: 20px;
}
</style>