import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { registerServices } from "./providers/services";
import { installUi } from "./providers/ui";
import router from "./providers/router";
import "./styles/style.scss";
import App from "./App.vue";

registerServices();

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
installUi(app);

app.mount("#app");
