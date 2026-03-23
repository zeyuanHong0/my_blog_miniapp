<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import useBlogStatsStore from "@/store/blogStats";

onLaunch(() => {
  console.log("App Launch");
  // 获取博客相关统计数据
  const blogStatsStore = useBlogStatsStore();
  blogStatsStore.getBlogStats();
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
