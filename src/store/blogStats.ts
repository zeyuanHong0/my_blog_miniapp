import { defineStore } from "pinia";
import { getBlogStats } from "@/api/stats";

const useBlogStatsStore = defineStore("blogStats", {
  state: () => ({
    blogCount: 0,
    tagCount: 0,
    categoryCount: 0,
  }),
  actions: {
    async getBlogStats() {
      try {
        const res = await getBlogStats();
        const {
          data: { blogCount, tagCount, categoryCount },
        } = res;
        this.blogCount = blogCount;
        this.tagCount = tagCount;
        this.categoryCount = categoryCount;
      } catch (error) {
        console.error("获取博客统计数据失败:", error);
      }
    },
  },
});

export default useBlogStatsStore;
