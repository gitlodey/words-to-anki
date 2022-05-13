<template>
  <div class="expansion-panel-list">
    <slot name="panels" :allPanelsOpen="allPanelsOpen"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  panels: unknown[];
  allPanelsOpen: boolean;
  accordion?: boolean;
}>();
</script>

<style scoped></style>
