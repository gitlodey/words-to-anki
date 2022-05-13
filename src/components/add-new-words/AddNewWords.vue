<template>
  <div class="add-words-form">
    <v-text-field
      class="add-words-form--field"
      v-if="isSingleWordForm"
      v-model="inputData"
      density="compact"
      variant="outlined"
      @keydown.enter="handleInput"
    ></v-text-field>
    <v-textarea
      class="add-words-form--field"
      v-else
      v-model="inputData"
      variant="outlined"
    ></v-textarea>
    <v-btn
      height="40"
      @click="handle"
      class="add-words-form--btn"
      color="primary"
    >
      Find meaning
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

//props
const props = defineProps<{
  isSingleWordForm: boolean;
}>();

//data
let inputData = ref("");

//computed
const wordsArray = computed(() => {
  return inputData.value.split(/\n/).filter((word) => word !== "");
});

//events
const emit = defineEmits<{
  (e: "addWord", word: string): void;
}>();

//methods
const handle = () => {
  if (props.isSingleWordForm) {
    handleInput();
  } else {
    handleTextarea();
  }
};
const handleInput = () => {
  emit("addWord", inputData.value);
  inputData.value = "";
};
const handleTextarea = () => {
  wordsArray.value.forEach((word) => {
    emit("addWord", word);
  });
  inputData.value = "";
};
</script>

<style lang="scss" scoped>
.add-words-form {
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-column-gap: 20px;
}
</style>
