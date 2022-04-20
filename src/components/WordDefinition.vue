<template>
  <div>
    <input type="checkbox" :checked="definition.include" @click="$emit('toggleInclude', !definition.include)">
    Definition ({{definition.partOfSpeech}}): {{definition.definition}}
    <br>
    <span v-if="definition.example">
      Example: {{definition.example}}
    </span>
  </div>
</template>

<script setup lang="ts">
import type {DefinitionWithPartOfSpeech} from "@/components/word-card/WordCard.vue";

defineProps<{
  definition: DefinitionWithPartOfSpeech,
}>()

defineEmits<{
  (e: 'toggleInclude', includeState: boolean ): void;
}>()


</script>

<style scoped>

</style>