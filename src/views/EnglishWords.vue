<template>
  <div>
    <h1>Add new English Words to your Anki</h1>

    <v-tabs v-model="selectedInputType" class="input-selector">
      <v-tab :value="InputTypes.one">{{ InputTypes.one }}</v-tab>
      <v-tab :value="InputTypes.list">{{ InputTypes.list }}</v-tab>
    </v-tabs>

    <word-add-form
      :is-single-word-form="isSingleWordFormShow"
      @addWord="handleAddWordsForm"
    />

    <h2 v-if="words.length > 1" class="mb20">Words list</h2>

    <v-btn v-if="words.length > 0" class="mb20" @click="globalToggle">
      {{ globalToggleText }}
    </v-btn>

    <div class="word-card-list">
      <expansion-panel
        v-for="word in words"
        :open="allPanelsOpen"
        :key="word.word"
        :style="{ marginBottom: '20px' }"
      >
        <template #head>
          <v-card>
            <v-card-text class="pb-0">
              <p class="text-h5">
                {{ word.word }}
              </p>
              <p>
                {{ word.meaning.meanings[0].definitions[0].definition }}
              </p>
            </v-card-text>
          </v-card>
        </template>
        <template #body>
          <word-card
            :ref="addWordCardRef"
            :card="word"
            @findNewWord="handleAddWordsForm"
          />
        </template>
      </expansion-panel>
    </div>

    <div class="button-container">
      <v-btn v-if="words.length" @click="saveWordsToAnki" color="success">
        Save to anki
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import DictionaryApi from "@/api/DictionaryApi";
import WordCard from "@/components/WordCard.vue";
import WordAddForm from "@/components/WordAddForm.vue";
import ankiConnectApi from "@/api/AnkiConnectApi";
import LinguaRobotApi from "@/api/lingua-robot-api";
import ExpansionPanel from "@/components/ExpansionPanel.vue";
import InputTypes from "@/types/InputTypes";
import type { LinguaRobotResponse } from "@/types/lingua-robot-types";
import type WordCardComponentRef from "@/types/WordCardComponentRef";
import type { WordWithMeaningsType } from "@/types/WordWithMeaningsType";
import type { DictionaryApiResponse } from "@/types/DictionaryApi";

//data
const wordCardInstances = ref<WordCardComponentRef[] | null>([]);
const words = reactive<WordWithMeaningsType[]>([]);
let selectedInputType = ref<InputTypes>(InputTypes.one);
let allPanelsOpen = ref<boolean>(true);

//computed
let isSingleWordFormShow = computed(
  () => selectedInputType.value === InputTypes.one
);
let globalToggleText = computed(() =>
  allPanelsOpen.value ? "Close all" : "Open all"
);

//methods
const handleAddWordsForm = async (word: string) => {
  const preparedWord = word.trim().toLowerCase();
  const { dictionaryApiResponse, linguaRobotResponse } = await findMeaning(
    preparedWord
  );
  if (dictionaryApiResponse && linguaRobotResponse) {
    addNewWord(dictionaryApiResponse, linguaRobotResponse);
  }
};
const addNewWord = (
  dictionaryApiResponse: DictionaryApiResponse,
  linguaRobotResponse: LinguaRobotResponse
) => {
  words.unshift({
    word: dictionaryApiResponse?.word,
    meaning: dictionaryApiResponse,
    linguaRobotResponse: linguaRobotResponse,
  });
};
const findMeaning = async (word: string) => {
  try {
    const dictionaryApiResponse = await DictionaryApi.getMeaning(word);
    const linguaRobotResponse = await LinguaRobotApi.getWord(word);

    return {
      dictionaryApiResponse,
      linguaRobotResponse,
    };
  } catch (e) {
    if (e instanceof Error) {
      alert(`${word}: ${e.message}`);
    }
    return {};
  }
};
const saveWordsToAnki = () => {
  wordCardInstances?.value?.forEach((wordCard) => {
    ankiConnectApi.addWord(
      {
        word: wordCard.wordStr,
        shortDefinition: wordCard.formatDefinitionsForAnki(),
      },
      wordCard.getAudioForAnki(),
      wordCard.getImageData()
    );
  });
};

const globalToggle = () => (allPanelsOpen.value = !allPanelsOpen.value);

function addWordCardRef(el: WordCardComponentRef) {
  if (el && "formatDefinitionsForAnki" in el) {
    if (wordCardInstances?.value?.includes(el) === false) {
      wordCardInstances.value.push(el);
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

.panel-header {
  padding: 20px;
}
</style>
