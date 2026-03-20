import { defineStore } from "pinia";

const useBlogStatsStore = defineStore("blogStats", {
  state: () => ({
    blogCount: 0,
    tagCount: 0,
    categoryCount: 0,
  }),
  actions: {},
});

export default useBlogStatsStore;
