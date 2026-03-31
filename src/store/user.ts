import { defineStore } from "pinia";
import { getWxCode, loginByCode } from "@/api/login";

const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
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
  },
});

export default useUserStore;
