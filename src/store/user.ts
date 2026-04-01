import { defineStore } from "pinia";
import { getWxCode, loginByCode, fetchIsUserAdmin } from "@/api/login";
import { getStatus } from "@/api/status";

const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
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
        this.token = res.data?.token;
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
  },
});

export default useUserStore;
