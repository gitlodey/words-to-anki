<template>
  <v-card>
    <v-card-text>
      <div class="word-card">
        <div class="word-card--content">
          <v-btn
            v-for="lemma in card.normalizedLemmas"
            :key="lemma"
            @click="findForLemma(lemma)"
            size="small"
            color="primary"
            class="mb-2"
          >
            {{ lemma }}
          </v-btn>
          <word-meta
            :phonetic="card.meta.phonetic"
            :phonetics="card.meta.phonetics"
            :antonyms="card.meta.antonyms"
            :synonyms="card.meta.synonyms"
            :part-of-speech="card.meta.partOfSpeech"
          />
          <word-definition
            v-for="definition in card.definitions"
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

          <div
            class="new-definition-form"
            v-if="state.addDefinitionEnabled"
          >
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
              <option
                v-for="item in PartOfSpeechList"
                :key="item"
              >
                {{ item }}
              </option>
            </select>

            <div class="button-container">
              <v-btn
                @click="addDefinition"
                color="success"
              >
                add
              </v-btn>
              <v-btn
                @click="cancelNewDefinition"
                color="error"
              >
                cancel
              </v-btn>
            </div>
          </div>
        </div>
        <div
          class="word-card--image"
          @paste="handlePasteFile"
        >
          <label
            class="word-card--image-label"
            for="image-download"
          >
            <span class="word-card--image-icon">🖼️</span>
            <span>drop or paste image here or click on frame</span>
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
            <template v-if="card.image">
              <img
                :src="card.image?.data"
                :alt="card.word"
              />
              <div class="button-wrap">
                <v-btn
                  size="small"
                  class="float-md-right mt-2"
                  @click="deleteImage"
                >
                  Delete image
                </v-btn>
              </div>
            </template>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script
  lang="ts"
  setup
>
import WordMeta from "@/components/WordMeta.vue";
import WordDefinition from "@/components/WordDefinition.vue";
import { reactive, ref } from "vue";
import { PartOfSpeechList } from "@/types/PartOfSpeechList";
import { v4 as uuidv4 } from "uuid";
import { useEnglishWords } from "@/store/EnglishWords";
import type PartOfSpeech from "@/types/PartOfSpeechList";
import type DefinitionWithPartOfSpeech from "@/types/DefinitionWithPartOfSpeech";
import type EnglishWordCard from "@/types/EnglishWordCard";

const englishWordsStore = useEnglishWords();

//props
const props = defineProps<{
  card: EnglishWordCard;
}>();

//data
const state = reactive<{
  addDefinitionEnabled: boolean;
}>({
  addDefinitionEnabled: false,
});

let newDefinition = ref("");
let newExample = ref("");
let newPartOfSpeech = ref<PartOfSpeech>("");

const emit = defineEmits<{
  (e: "findNewWord", word: string): void;
}>();

//methods
const findForLemma = (lemma: string) => {
  emit("findNewWord", lemma);
};
const toggleInclude = (
  include: boolean,
  definition: DefinitionWithPartOfSpeech
) => {
  englishWordsStore.updateDefinitionStatus(props.card, definition, include);
};
const addDefinition = () => {
  englishWordsStore.addDefinitionToWord(props.card, {
    definition: newDefinition.value,
    example: newExample.value,
    partOfSpeech: newPartOfSpeech.value,
    include: true,
    synonyms: [],
    antonyms: [],
  });

  cancelNewDefinition();
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
    reader.onloadend = () => {
      const result = reader.result as string;
      let filename = "";
      if (fileList?.length) {
        const fileNameArr = fileList[0].name.split(".");
        const uuid = uuidv4();
        fileNameArr[0] = `${fileNameArr[0]}-${uuid}`;
        filename = fileNameArr.join(".");
      }

      englishWordsStore.updateWordImage(props.card, {
        data: result,
        filename,
      });
    };

    reader.readAsDataURL(fileList[0]);
  }
};
const deleteImage = () => englishWordsStore.updateWordImage(props.card, null);
const addDefinitionFormToggle = () =>
  (state.addDefinitionEnabled = !state.addDefinitionEnabled);
</script>

<style
  lang="scss"
  scoped
>
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
