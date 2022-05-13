import { createRouter, createWebHistory } from "vue-router";
import EnglishWords from "../views/EnglishWords.vue";
import TurkishWords from "@/views/TurkishWords.vue";

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
  ],
});

export default router;
