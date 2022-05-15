import http from "@/api/Http";

export interface WordWithShortDefinition {
  word: string;
  shortDefinition: string;
}

export interface Audio {
  url: string;
  filename: string;
  fields: ["Front"];
}

export interface Image {
  url?: string;
  data?: string;
  path?: string;
  filename: string;
  fields?: ["Back"];
}

const ANKI_CONNECT_URL = "http://127.0.0.1:8765";
const ANKI_DECK_NAME = "English 2022";

class AnkiConnect {
  async invoke(action: string, version: number, params = {}) {
    return await http.get(ANKI_CONNECT_URL, {
      method: "post",
      body: JSON.stringify({ action, version, params }),
      headers: { "Content-Type": "application/json" },
    });
  }

  async addWord(
    word: WordWithShortDefinition,
    audioUrl?: string | undefined,
    imageData?: Image | null,
  ) {
    let audio: Audio | undefined;
    let picture: Image | undefined;
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
        deckName: ANKI_DECK_NAME,
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
}

export default new AnkiConnect();
