import { defineStore } from "pinia";
import api from "@/api";

interface AnkiStore {
  url: string;
  deckName: string;
}

export const useAnki = defineStore("anki", {
  state(): AnkiStore {
    return {
      url: "",
      deckName: "",
    };
  },
  actions: {
    setData(url: string, deckName: string) {
      this.url = url;
      this.deckName = deckName;

      window.localStorage.setItem("ANKI_CONNECT_URL", url);
      window.localStorage.setItem("ANKI_DECK_NAME", deckName);

      api.anki.setConnectSettings(url, deckName);
    },
    setInitialData() {
      const { url, deckName } = api.anki.getConnectSettings();
      this.setData(url, deckName);
    },
    update() {
      window.localStorage.setItem("ANKI_CONNECT_URL", this.url);
      window.localStorage.setItem("ANKI_DECK_NAME", this.deckName);

      api.anki.setConnectSettings(this.url, this.deckName);
    },
    reset() {
      const url = window.localStorage.getItem("ANKI_CONNECT_URL") || "";
      const deckName = window.localStorage.getItem("ANKI_DECK_NAME") || "";

      this.setData(url, deckName);
    },
  },
});
