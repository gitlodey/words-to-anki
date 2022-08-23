import EnglishWords from "../views/EnglishWords.vue";
import TurkishWords from "@/views/TurkishWords.vue";
import WordsList from "@/views/WordsList.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/en",
      name: "English",
      component: EnglishWords,
    },
    {
      path: "/tr",
      name: "Turkish",
      component: TurkishWords,
    },
    {
      path: "/list",
      name: "List",
      component: WordsList,
    },
  ],
});

export default router;
