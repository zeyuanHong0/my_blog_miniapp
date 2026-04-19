<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import useBlogStatsStore from "@/store/blogStats";
import useSettingsStore from "./store/settings";
import useUserStore from "@/store/user";
import WebSocketManager from "@/utils/websocket";
import "@/styles/theme/index.scss";

let wsManager: WebSocketManager | null = null;

onLaunch(async () => {
  console.log("App Launch");
  const { toggleTheme } = useSettingsStore();
  uni.getSystemInfo({
    success: (res: any) => {
      // console.log("system info", res);
      toggleTheme(res.theme);
    },
  });
  uni.onThemeChange((res) => {
    // console.log("theme change", res);
    toggleTheme(res.theme);
  });
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
