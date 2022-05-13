<template>
  <v-card>
    <v-card-text>
      <div class="word-card text--primary">
        <div class="word-card--content">
          <v-btn
            v-for="lemma in normalizedLemmas"
            :key="lemma"
            @click="findForLemma(lemma)"
            size="small"
            color="primary"
          >
            {{ lemma }}
          </v-btn>
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

          <v-btn
            v-if="state.addDefinitionEnabled === false"
            @click="addDefinitionFormToggle"
          >
            add your definition
          </v-btn>

          <div class="new-definition-form" v-if="state.addDefinitionEnabled">
            <v-text-field
              v-model="newDefinition"
              density="compact"
              variant="outlined"
            />
            <v-text-field
              v-model="newExample"
              density="compact"
              variant="outlined"
            />
            <select v-model="newPartOfSpeech">
              <option value=""></option>
              <option v-for="item in PartOfSpeechList" :key="item">
                {{ item }}
              </option>
            </select>

            <div class="button-container">
              <v-btn @click="addDefinition" color="success"> add </v-btn>
              <v-btn @click="cancelNewDefinition" color="error"> cancel </v-btn>
            </div>
          </div>
        </div>
        <div class="word-card--image" @paste="handlePasteFile">
          <label class="word-card--image-label" for="image-download">
            <div class="word-card--image-icon">🖼️</div>
            <div>drop or paste image here or click on frame</div>
            <input
              id="image-download"
              class="word-card--image-input"
              type="file"
              @change="handleFileUpload"
              @dragover.prevent
              @drop="handleFileUpload"
            />
          </label>

          <div class="word-card--image-container">
            <img v-if="state.image" :src="state.image?.data" />
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from "vue";
import type { WordWithMeaningsType } from "@/views/GetWords.vue";
import type DefinitionWithPartOfSpeech from "./DefinitionWithPartOfSpeech";
import type IWordMeta from "./IWordMeta";
import WordMeta from "@/components/WordMeta.vue";
import WordDefinition from "@/components/WordDefinition.vue";
import type PartOfSpeech from "./PartOfSpeechList";
import { PartOfSpeechList } from "./PartOfSpeechList";
import type WordCardComponentRef from "./WordCardComponentRef";
import type { Image } from "@/services/anki-connect-api";
import { v4 as uuidv4 } from "uuid";

//props
const props = defineProps<{
  card: WordWithMeaningsType;
}>();

//data
const state = reactive<{
  definitions: DefinitionWithPartOfSpeech[];
  newDefinitions: DefinitionWithPartOfSpeech[];
  addDefinitionEnabled: boolean;
  image: Image | null;
}>({
  definitions: [],
  newDefinitions: [],
  addDefinitionEnabled: false,
  image: null,
});

let newDefinition = ref("");
let newExample = ref("");
let newPartOfSpeech = ref<PartOfSpeech>("");

const emit = defineEmits<{
  (e: "findNewWord", word: string): void;
}>();

watch(
  props.card,
  (newCard) => {
    const clonedCard: WordWithMeaningsType = { ...newCard };
    state.definitions = clonedCard.meaning.meanings.reduce(
      (acc: DefinitionWithPartOfSpeech[], meaning) => {
        const preparedDefinitions = meaning.definitions.map(
          (definition): DefinitionWithPartOfSpeech => {
            return {
              ...definition,
              partOfSpeech: meaning.partOfSpeech,
              include: true,
            };
          }
        );
        acc.push(...preparedDefinitions);
        return acc;
      },
      []
    );
  },
  {
    deep: true,
    immediate: true,
  }
);

//computed
const sortedDefinitions = computed(() => {
  const clonedDefinitions = [...state.newDefinitions, ...state.definitions];
  return clonedDefinitions.sort((defA, defB) => {
    if (defA.include === true && defB.include === false) return -1;
    if (defA.include === false && defB.include === true) return 1;
    return 0;
  });
});
const wordMeta = computed<IWordMeta>(() => {
  return props.card.meaning.meanings.reduce(
    (acc: IWordMeta, meaning) => {
      acc.synonyms.push(...meaning.synonyms);
      acc.antonyms.push(...meaning.antonyms);
      acc.partOfSpeech.push(meaning.partOfSpeech);

      return acc;
    },
    {
      phonetic: props.card.meaning.phonetic,
      phonetics: props.card.meaning.phonetics,
      synonyms: [],
      antonyms: [],
      partOfSpeech: [],
    }
  );
});
const normalizedLemmas = computed(() => {
  const entries = props.card.linguaRobotResponse?.entries;
  if (entries) {
    return entries
      .map((entry) => entry.interpretations)
      .flat()
      .map((interpretation) => interpretation.normalizedLemmas)
      .flat()
      .map((lemma) => lemma.lemma)
      .filter((lemma) => lemma !== props.card.word);
  }

  return [];
});
const audioUrl = computed(
  (): string | undefined =>
    props.card.meaning?.phonetics.find((item) => item.audio)?.audio
);
const wordStr = computed(() => props.card.word);

//methods
const findForLemma = (lemma: string) => {
  emit("findNewWord", lemma);
};
const toggleInclude = (
  include: boolean,
  definition: DefinitionWithPartOfSpeech
) => {
  definition.include = include;
};
const addDefinition = () => {
  state.newDefinitions.push({
    definition: newDefinition.value,
    example: newExample.value,
    partOfSpeech: newPartOfSpeech.value,
    include: true,
    synonyms: [],
    antonyms: [],
  });

  newDefinition.value = "";
  newExample.value = "";
};
const cancelNewDefinition = () => {
  newDefinition.value = "";
  newExample.value = "";
  newPartOfSpeech.value = "";
  addDefinitionFormToggle();
};
const handleFileUpload = (event: Event) => {
  const element = event.currentTarget as HTMLInputElement;
  const fileList: FileList | null = element.files;
  uploadImg(fileList);
};
const handlePasteFile = (event: ClipboardEvent) => {
  let fileList: FileList | null = event?.clipboardData?.files || null;
  uploadImg(fileList);
};
const uploadImg = (fileList: FileList | null) => {
  if (fileList) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const result = reader.result as string;
      let filename = "";
      if (fileList?.length) {
        const fileNameArr = fileList[0].name.split(".");
        const uuid = uuidv4();
        fileNameArr[0] = `${fileNameArr[0]}-${uuid}`;
        filename = fileNameArr.join(".");
      }
      state.image = {
        data: result,
        filename,
      };
    };

    reader.readAsDataURL(fileList[0]);
  }
};
const addDefinitionFormToggle = () =>
  (state.addDefinitionEnabled = !state.addDefinitionEnabled);
const formatDefinitionsForAnki = (): string => {
  let totalDefinition = "";

  totalDefinition += `<h1>${props.card.word}</h1>`;
  props.card.meaning.phonetics.map((phonetic, index, array) => {
    if (phonetic.text) {
      totalDefinition += `<i>${phonetic.text}</i><br/>`;
    }

    if (index > 0 && array.length === index) {
      totalDefinition += `<br/>`;
    }
  });
  if (wordMeta.value.partOfSpeech.length > 0) {
    totalDefinition += `Part of speech: <p>${wordMeta.value.partOfSpeech.join(
      ", "
    )}</p>`;
  }
  if (wordMeta.value.synonyms.length > 0) {
    totalDefinition += `Synonims: <p>${wordMeta.value.synonyms.join(", ")}</p>`;
  }
  if (wordMeta.value.antonyms.length > 0) {
    totalDefinition += `Antonyms: <p>${wordMeta.value.antonyms.join(", ")}</p>`;
  }
  sortedDefinitions.value.map((definition) => {
    if (definition.include) {
      totalDefinition += `<b>Definition${
        definition.partOfSpeech ? " (" + definition.partOfSpeech + ")" : ""
      }:</b> <span>${definition.definition}</span>`;
      if (definition.example) {
        totalDefinition += `<br/><b>Example:</b> <span>${definition.example}</span><br/><br/>`;
      } else {
        totalDefinition += `<br/><br/>`;
      }
    }
  });

  return totalDefinition;
};
const getAudioForAnki = (): string | undefined => audioUrl.value;
const getImageData = (): Image | null => {
  if (state.image) {
    return {
      data: state.image.data?.replace("data:", "").replace(/^.+,/, ""),
      filename: state.image.filename,
    };
  }

  return null;
};

defineExpose<WordCardComponentRef>({
  formatDefinitionsForAnki,
  getAudioForAnki,
  getImageData,
  wordStr: wordStr.value,
});
</script>

<style lang="scss" scoped>
.word-card {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-column-gap: 20px;

  &--image {
    &-label {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      cursor: pointer;
      transition: 0.3s ease background-color;

      &:hover {
        background-color: #f5f5f5;
      }
    }

    &-input {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      opacity: 0;
    }

    &-icon {
      font-size: 50px;
      padding: 5px;
    }

    &-container {
      height: calc(100% - 100px);
      > img {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}
.new-definition-form {
  padding: 20px;
  transition: 0.3s ease background-color;

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
