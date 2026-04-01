<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import useBlogStatsStore from "@/store/blogStats";
import useUserStore from "@/store/user";

onLaunch(async () => {
  console.log("App Launch");
  // 获取博客相关统计数据
  const blogStatsStore = useBlogStatsStore();
  blogStatsStore.getBlogStats();

  const userStore = useUserStore();
  await Promise.all([
    blogStatsStore.getBlogStats(),
    userStore.fetchStatus(),
    userStore.login().then(() => userStore.checkAdmin()),
  ]);
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
