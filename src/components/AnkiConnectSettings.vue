<template>
  <v-card class="mb-4">
    <v-card-text>
      <div class="mb-2">Anki-connect URL</div>
      <v-text-field
        v-model="ankiStore.url"
        density="compact"
        variant="outlined"
      />

      <div class="mb-2">Deck name</div>
      <v-text-field
        v-model="ankiStore.deckName"
        density="compact"
        variant="outlined"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        class="float-md-right"
        @click="ankiStore.update"
      >
        Update
      </v-btn>
      <v-btn
        class="float-md-right mr-4"
        @click="ankiStore.reset"
      >
        Reset
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script
  lang="ts"
  setup
>
import { useAnki } from "@/store/Anki";
import { onMounted } from "vue";

const ankiStore = useAnki();

onMounted(() => {
  const ankiConnectUrl = window.localStorage.getItem("ANKI_CONNECT_URL");
  const ankiDeckName = window.localStorage.getItem("ANKI_DECK_NAME");

  if (ankiConnectUrl && ankiDeckName) {
    ankiStore.setData(ankiConnectUrl, ankiDeckName);
  } else {
    ankiStore.setInitialData();
  }
});
</script>
