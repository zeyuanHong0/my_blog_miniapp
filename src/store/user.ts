import { defineStore } from "pinia";
import {
  getWxCode,
  loginByCode,
  fetchIsUserAdmin,
  refreshToken,
} from "@/api/login";
import { getStatus } from "@/api/status";

const useUserStore = defineStore("user", {
  state: () => ({
    access_token: "",
    refresh_token: "",
    statusInfo: {
      is_online: false,
      status_text: "",
      status_desc: "",
    },
    isAdmin: false,
  }),
  actions: {
    async login() {
      try {
        const code = await getWxCode();
        const res = await loginByCode(code);
        this.access_token = res.data?.access_token;
        this.refresh_token = res.data?.refresh_token;
      } catch (error) {
        console.error("登录失败:", error);
      }
    },
    async fetchStatus() {
      try {
        const res = await getStatus();
        this.statusInfo = {
          is_online: res.data?.is_online === 1 ? true : false,
          status_text: res.data?.status_text ?? "",
          status_desc: res.data?.status_desc ?? "",
        };
      } catch (error) {
        console.error("获取状态失败:", error);
      }
    },
    async checkAdmin() {
      try {
        const res = await fetchIsUserAdmin();
        this.isAdmin = res.data?.isAdmin ?? false;
      } catch (error) {
        console.error("检查管理员权限失败:", error);
      }
    },
    async refreshToken() {
      try {
        const res = await refreshToken(this.refresh_token);
        this.access_token = res.data?.access_token;
      } catch (error) {
        console.error("刷新 token 失败:", error);
      }
    },
  },
});

export default useUserStore;
