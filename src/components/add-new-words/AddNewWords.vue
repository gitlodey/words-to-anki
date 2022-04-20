<template>
  <div class="add-words-form">
    <input
        v-if="isSingleWordForm"
        v-model="inputData"
        @keydown.enter="handleInput"
    />
    <textarea v-else v-model="inputData"></textarea>
    <button @click="handle">
      Find meaning for word
    </button>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";

//props
const props = defineProps<{
  isSingleWordForm: boolean,
}>()

//data
let inputData = ref('')


//computed
const wordsArray = computed(() => {
  return inputData.value
      .split(/\n/)
      .filter(word => word !== '')
})

//events
const emit = defineEmits<{
  (e: 'addWord', word: string ): void
}>()

//methods
const handle = () => {
  if (props.isSingleWordForm) {
    handleInput()
  } else {
    handleTextarea()
  }
}
const handleInput = () => {
  emit('addWord', inputData.value)
  inputData.value = ''
}
const handleTextarea = () => {
  wordsArray.value.forEach(word => {
    emit('addWord', word)
  })
  inputData.value = ''
}
</script>
