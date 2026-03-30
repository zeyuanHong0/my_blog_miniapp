<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import useBlogStatsStore from "@/store/blogStats";
import { getWxCode, handleLogin } from "@/api/login";

onLaunch(async () => {
  console.log("App Launch");
  // 获取博客相关统计数据
  const blogStatsStore = useBlogStatsStore();
  blogStatsStore.getBlogStats();

  const code = await getWxCode();
  await handleLogin(code as string);
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style></style>
