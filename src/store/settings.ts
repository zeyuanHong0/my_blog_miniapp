import { defineStore } from "pinia";

type Theme = "light" | "dark";

const useSettingsStore = defineStore("settings", {
  state: () => ({
    theme: "light",
  }),
  getters: {
    isDark: (state) => state.theme === "dark",
  },
  actions: {
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },
    setTheme(theme: Theme) {
      this.theme = theme;
    },
  },
});

export default useSettingsStore;
