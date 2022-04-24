<template>
  <div class="expansion-panel">
    <div class="expansion-panel--head">
      <slot name="head"></slot>
      <button @click="toggle">toggle</button>
    </div>
    <div class="expansion-panel--body">
      <transition
          @before-enter="show"
          @enter="hide"
          @before-leave="hide"
          @leave="show"
      >
        <section class="expansion-panel--content" v-if="isOpen">
          <slot name="body"></slot>
        </section>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';

const props = defineProps<{
  open: boolean,
}>()

let isOpen = ref<boolean>(props.open)

watch(
    () => props.open,
    (open) => {
      isOpen.value = open
    },
    {
      immediate: true,
    }
)

//methods
const toggle = () => isOpen.value = !isOpen.value
const show = (element: HTMLElement) => {
  element.style.height = '0'
  element.style.opacity = '0'
}
const hide = (element: HTMLElement) => {
  element.style.height = 'auto'
  element.style.opacity = '1'
}
</script>

<style scoped>

</style>