import { createRouter, createWebHistory } from "vue-router";
import GetWords from "../views/GetWords.vue";
import EnglishWords from "../views/EnglishWords/EnglishWords.vue";
import TurkishWords from "@/views/TurkishWords.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: GetWords,
    },
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
