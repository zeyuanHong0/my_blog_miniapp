import { createSSRApp } from "vue";
import App from "./App.vue";
import "./styles/common.scss";
import '@tdesign/uniapp/common/style/theme/index.css';
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
