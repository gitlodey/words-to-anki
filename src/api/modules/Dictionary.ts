import type DictionaryApiError from "@/types/DictionaryApiError";
import type { DictionaryApiResponse } from "@/types/DictionaryApi";

class Dictionary {
  readonly url: string = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  async getWord(word: string) {
    const response = await fetch(`${this.url}${word}`);
    const body: DictionaryApiResponse[] | DictionaryApiError =
      await response.json();

    if (response.ok && body instanceof Array) {
      return body[0];
    }

    if ("message" in body) {
      throw new Error(body.message);
    }
  }
}

export default new Dictionary();
