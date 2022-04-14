<template>
  <div>
    <input type="checkbox" :checked="definition.include">
    Definition ({{definition.partOfSpeech}}): {{definition.definition}}
    <br>
    <span v-if="definition.example">
      Example: {{definition.example}}
    </span>
  </div>
</template>

<script setup lang="ts">
import type {DefinitionWithPartOfSpeech} from "@/components/WordCard.vue";

defineProps<{
  definition: DefinitionWithPartOfSpeech,
}>()
</script>

<style scoped>

</style>