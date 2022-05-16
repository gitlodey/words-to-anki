<template>
  <div>
    <h1>Add new English Words to your Anki</h1>
    <v-btn
      class="mb-4"
      size="small"
      @click="toggleSettingsForm"
    >
      Anki connect plugin settings
    </v-btn>
    <expansion-panel :open="settingsIsOpen">
      <template #body>
        <anki-connect-settings></anki-connect-settings>
      </template>
    </expansion-panel>

    <v-tabs
      v-model="selectedInputType"
      class="input-selector"
    >
      <v-tab :value="InputTypes.one">{{ InputTypes.one }}</v-tab>
      <v-tab :value="InputTypes.list">{{ InputTypes.list }}</v-tab>
    </v-tabs>

    <word-add-form
      :is-single-word-form="isSingleWordFormShow"
      @addWord="handleAddWordsForm"
    />

    <h2
      v-if="englishWordsStore.words.length > 1"
      class="mb-4"
    >
      Words list
    </h2>

    <v-btn
      v-if="englishWordsStore.words.length > 0"
      class="mb-4"
      @click="globalToggle"
    >
      {{ globalToggleText }}
    </v-btn>

    <div class="word-card-list">
      <expansion-panel
        v-for="word in englishWordsStore.words"
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
                {{ word.definitions[0].definition }}
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn @click="deleteWord(word)"> 🗑️ </v-btn>
            </v-card-actions>
          </v-card>
        </template>
        <template #body>
          <word-card
            :card="word"
            @findNewWord="handleAddWordsForm"
          />
        </template>
      </expansion-panel>
    </div>

    <div class="button-container">
      <v-btn
        v-if="englishWordsStore.words.length"
        @click="saveWordsToAnki"
        color="success"
      >
        Save to anki
      </v-btn>
    </div>
  </div>
</template>

<script
  lang="ts"
  setup
>
import WordCard from "@/components/WordCard.vue";
import WordAddForm from "@/components/WordAddForm.vue";
import ExpansionPanel from "@/components/ExpansionPanel.vue";
import InputTypes from "@/types/InputTypes";
import { computed, ref } from "vue";
import { useEnglishWords } from "@/store/EnglishWords";
import type EnglishWordCard from "@/types/EnglishWordCard";
import AnkiConnectSettings from "@/components/AnkiConnectSettings.vue";

const englishWordsStore = useEnglishWords();

//data
let selectedInputType = ref<InputTypes>(InputTypes.one);
let allPanelsOpen = ref<boolean>(true);
let settingsIsOpen = ref<boolean>(false);

//computed
let isSingleWordFormShow = computed(
  () => selectedInputType.value === InputTypes.one,
);
let globalToggleText = computed(() =>
  allPanelsOpen.value ? "Close all" : "Open all",
);

//methods
const handleAddWordsForm = async (word: string) => {
  await englishWordsStore.getWord(word.trim().toLowerCase());
};

const saveWordsToAnki = () => englishWordsStore.saveWordsToAnki();
const globalToggle = () => (allPanelsOpen.value = !allPanelsOpen.value);
const deleteWord = (word: EnglishWordCard) => {
  englishWordsStore.deleteWord(word);
};
const toggleSettingsForm = () => (settingsIsOpen.value = !settingsIsOpen.value);
</script>

<style
  lang="scss"
  scoped
>
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
