import "vuetify/styles"; // Global CSS has to be imported
import App from "./App.vue";
import router from "./router";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);
app.use(
  createVuetify({
    components,
    directives,
  })
);
app.use(createPinia());

app.mount("#app");
