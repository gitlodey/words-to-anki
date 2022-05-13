import type { Image } from "@/api/AnkiConnectApi";

interface WordCardComponentRef {
  wordStr: string;
  getImageData(): Image | null;
  formatDefinitionsForAnki(): string;
  getAudioForAnki(): string | undefined;
}

export default WordCardComponentRef;
