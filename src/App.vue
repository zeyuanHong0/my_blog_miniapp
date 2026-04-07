<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import useBlogStatsStore from "@/store/blogStats";
import useUserStore from "@/store/user";
import WebSocketManager from "@/utils/websocket";

let wsManager: WebSocketManager | null = null;

onLaunch(async () => {
  console.log("App Launch");
  // 获取博客相关统计数据
  const blogStatsStore = useBlogStatsStore();
  const userStore = useUserStore();
  await Promise.all([
    blogStatsStore.getBlogStats(),
    userStore.fetchStatus(),
    (async () => {
      await userStore.login();
      await userStore.checkAdmin();
    })(),
  ]);
  wsManager = new WebSocketManager({
    onMessage: (data) => {
      // console.log("WebSocket message:", data);
      if (data.event === "status_update") {
        userStore.changeStatus(data.data);
      }
    },
  });
  wsManager.connect();
});
onShow(() => {
  console.log("App Show");
  if (!(wsManager && wsManager.getIsConnected())) {
    wsManager?.connect();
  }
});
onHide(() => {
  console.log("App Hide");
  wsManager?.close();
});
</script>
<style></style>
