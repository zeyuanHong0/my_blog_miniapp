import { createSSRApp } from "vue";
import App from "./App.vue";
import "./styles/common.scss";
import "@tdesign/uniapp/common/style/theme/index.css";
import * as Pinia from "pinia";
export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  return {
    app,
    Pinia,
  };
}
