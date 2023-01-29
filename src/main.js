import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./assets/main.css";
import { registerGlobalComponent } from "./utils/inport";
import "./services/common.js";
const app = createApp(App);
registerGlobalComponent(app);
app.use(router);
app.use(store);
app.mount("#app");
