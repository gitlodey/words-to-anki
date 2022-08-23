<template>
  <div>
    <v-banner :sticky="sticky">
      <div class="content">
        Your current words data base size is:&nbsp;
        <span class="text-green">{{ wordsFromLocalStorage.length }}</span>
        total, and&nbsp;
        <span class="text-red">{{ newWordsFromLocalStorage.length }}</span> new.
      </div>
    </v-banner>

    <v-textarea
      counter
      label="Text"
      v-model="documentValue"
    />

    <template v-if="wordsCounter > 0">
      <v-chip
        class="ma-2"
        color="primary"
      >
        Total words in document: {{ wordsCounter }}
      </v-chip>

      <v-chip
        class="ma-2"
        color="red"
        text-color="white"
      >
        New words in document: {{ newWordsCounter }}
      </v-chip>

      <v-chip
        class="ma-2"
        color="green"
        text-color="white"
      >
        Known words in document: {{ knownWordsCounter }}
      </v-chip>

      <hr class="my-5" />
    </template>

    <v-btn
      @click="parseDocument"
      color="success"
    >
      Parse document
    </v-btn>

    <div class="ma-3">
      <div
        class="word"
        v-for="word in wordsFromDocument"
        :key="word.index"
        :class="{ new: word.new }"
        @click="addToNewWordsList(word)"
      >
        {{ word.word }}

        <div class="index">
          {{ word.counter }}
        </div>
      </div>
    </div>

    <template v-if="wordsCounter > 0">
      <hr class="my-5" />
      <v-btn
        @click="addUnselectedWordsToKnownList"
        color="success"
      >
        Add unselected to known list
      </v-btn>
    </template>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { ref, reactive } from "vue";

interface Word {
  word: string;
  counter: number;
  new?: boolean;
}

const wordsLocalStorageString = window.localStorage.getItem("words");
const newWordsLocalStorageString = window.localStorage.getItem("newWords");

//data
const wordsFromLocalStorage = wordsLocalStorageString
  ? wordsLocalStorageString.split(",")
  : [];
const newWordsFromLocalStorage = newWordsLocalStorageString
  ? newWordsLocalStorageString.split(",")
  : [];

const documentValue = ref("");
const wordsFromDocument = reactive<Word[]>([]);
const wordsCounter = ref(0);
const newWordsCounter = ref(0);
const knownWordsCounter = ref(0);

//methods
const parseDocument = () => {
  let documentString = documentValue.value.replace(/[^A-Za-z0-9]+/g, " ");
  let documentWords = documentString
    .trim()
    .split(" ")
    .reduce((acc: Word[], cur) => {
      const woz = cur.toLocaleLowerCase();
      const strings = acc.length > 0 ? acc.map((i) => i.word) : [];
      const index = strings.indexOf(woz);
      if (index > -1) {
        acc[index].counter += 1;
      } else {
        wordsCounter.value += 1;
        acc.push({
          word: woz,
          counter: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => {
      const aCounter = Number(a.counter);
      const bCounter = Number(b.counter);
      return aCounter - bCounter > 0 ? -1 : 1;
    })
    .filter((word) => !wordsFromLocalStorage.includes(word.word))
    .map((word) => {
      if (newWordsFromLocalStorage.includes(word.word)) {
        newWordsCounter.value += 1;
        word.new = true;
      }
      return word;
    });
  wordsFromDocument.push(...documentWords);
  knownWordsCounter.value = wordsCounter.value - newWordsCounter.value;
};
const addToNewWordsList = (word: Word) => {
  word.new = true;
  newWordsFromLocalStorage.push(word.word);
  console.log("your new words list size is: ", newWordsFromLocalStorage.length);
  const unique = new Set(newWordsFromLocalStorage);
  window.localStorage.setItem("newWords", [...unique].join(","));

  newWordsCounter.value += 1;
  knownWordsCounter.value -= 1;
};
const addUnselectedWordsToKnownList = () => {
  const unselectedWords = wordsFromDocument
    .filter((i) => !i.new)
    .map((i) => i.word);
  wordsFromLocalStorage.push(...unselectedWords);

  const unique = new Set(wordsFromLocalStorage);
  window.localStorage.setItem("words", [...unique].join(","));
};
</script>
<style lang="scss">
.word {
  padding: 5px 40px 5px 10px;
  border-radius: 5px;
  background-color: #a2dae2;
  display: inline-flex;
  margin: 5px;
  font-size: 18px;
  position: relative;
  cursor: pointer;

  &.new {
    background-color: #9f1313;
    color: #fff;
  }
}
.index {
  width: 30px;
  height: 30px;
  background-color: #25354d;
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
