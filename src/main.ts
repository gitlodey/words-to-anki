import "vuetify/styles"; // Global CSS has to be imported
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import router from "./router";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createPinia } from "pinia";

const app = createApp(App);
const vuetify = createVuetify({
  components,
  directives,
});

app.use(router);
app.use(vuetify);
app.use(createPinia());

app.mount("#app");
