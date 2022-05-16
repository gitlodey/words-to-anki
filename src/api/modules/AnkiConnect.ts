import http from "@/api/Http";
import type AnkiCardImage from "@/types/AnkiCardImage";

interface WordWithShortDefinition {
  word: string;
  shortDefinition: string;
}

interface Audio {
  url: string;
  filename: string;
  fields: ["Front"];
}

const ANKI_CONNECT_URL = "http://127.0.0.1:8765";
const ANKI_DECK_NAME = "";

class AnkiConnect {
  private url: string;
  private deckName: string;

  constructor(url: string, deckName: string) {
    this.url = url;
    this.deckName = deckName;
  }

  async invoke(action: string, version: number, params = {}) {
    return await http.get(this.url, {
      method: "post",
      body: JSON.stringify({ action, version, params }),
      headers: { "Content-Type": "application/json" },
    });
  }

  async addWord(
    word: WordWithShortDefinition,
    audioUrl?: string | undefined,
    imageData?: AnkiCardImage | null,
  ) {
    let audio: Audio | undefined;
    let picture: AnkiCardImage | undefined;
    if (audioUrl) {
      audio = {
        url: audioUrl,
        filename: audioUrl.split("/").pop() || "",
        fields: ["Front"],
      };
    }
    if (imageData) {
      picture = {
        data: imageData.data,
        filename: imageData.filename,
        fields: ["Back"],
      };
    }
    await this.invoke("addNote", 6, {
      note: {
        deckName: this.deckName,
        modelName: "Basic",
        fields: {
          Front: word.word,
          Back: word.shortDefinition,
        },
        options: {
          allowDuplicate: true,
        },
        audio,
        picture,
      },
    });
  }

  getConnectSettings() {
    return {
      url: this.url,
      deckName: this.deckName,
    };
  }

  setConnectSettings(url: string, deckName: string) {
    this.url = url;
    this.deckName = deckName;
  }
}

export default new AnkiConnect(ANKI_CONNECT_URL, ANKI_DECK_NAME);
