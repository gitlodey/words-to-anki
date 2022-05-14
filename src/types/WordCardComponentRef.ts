import type { Image } from "@/api/modules/AnkiConnect";

interface WordCardComponentRef {
  wordStr: string;
  getImageData(): Image | null;
  formatDefinitionsForAnki(): string;
  getAudioForAnki(): string | undefined;
}

export default WordCardComponentRef;
