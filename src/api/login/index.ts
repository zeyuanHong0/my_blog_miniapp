import { postRequest } from "@/utils/request";

// 获取微信登录的 code
export const getWxCode = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: "weixin",
      success: (res) => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(new Error("登录失败！" + res.errMsg));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

// 登录
export const handleLogin = async (code: string) => {
  try {
    const res = await postRequest("/miniapp/login", { code });
    uni.setStorageSync("openid", res.data?.openid);
  } catch (error) {
    console.error("登录失败:", error);
  }
};
