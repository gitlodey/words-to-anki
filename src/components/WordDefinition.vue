<template>
  <div class="word-definition">
    <input
        class="word-definition--checkbox"
        type="checkbox"
        :checked="definition.include"
        @click="$emit('toggleInclude', !definition.include)"
    />
    <div class="word-definition--content">
      <div>
        Definition
        <span v-if="definition.partOfSpeech.length > 0">
          ({{definition.partOfSpeech}})
        </span>
         : {{definition.definition}}
      </div>
      <div v-if="definition.example">
        Example: {{definition.example}}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type DefinitionWithPartOfSpeech from "./word-card/DefinitionWithPartOfSpeech";

defineProps<{
  definition: DefinitionWithPartOfSpeech,
}>()

defineEmits<{
  (e: 'toggleInclude', includeState: boolean ): void;
}>()


</script>

<style lang="scss" scoped>
.word-definition {
  margin-bottom: 10px;
  display: flex;

  &--content {
    padding-left: 10px;
  }
}
</style>