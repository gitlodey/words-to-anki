export interface LocalJsonWord {
  word: string;
  shortDefinition: string;
  longDefinition: string;
  secondDefinitions: LocalJsonSecondDefinition[];
}

interface LocalJsonSecondDefinition {
  partOfSpeech: string;
  definition: string;
}

class LocalJsonApi {
  readonly path: string = "./public/words-with-meanings-all-seasons.json";
  private dictionary: LocalJsonWord[] = [];

  async getDictionary() {
    try {
      const response = await fetch(this.path);
      this.dictionary = await response.json();
    } catch (e) {
      this.dictionary = [];
    }
  }

  async getMeaning(word: string) {
    if (this.dictionary.length === 0) {
      await this.getDictionary();
    }

    const searchResult = this.dictionary.filter((item) => item.word === word);
    return searchResult[0];
  }
}

export default new LocalJsonApi();
