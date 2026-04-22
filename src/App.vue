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
  const { setTheme } = useSettingsStore();
  const sysInfo = uni.getSystemInfoSync();
  if (sysInfo.theme) {
    setTheme(sysInfo.theme as 'light' | 'dark');
  }
  uni.onThemeChange((res) => {
    setTheme(res.theme as 'light' | 'dark');
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
