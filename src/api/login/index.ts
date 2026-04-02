import { getRequest, postRequest } from "@/utils/request";

export const getWxCode = (): Promise<string> => {
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

export const loginByCode = (code: string) => {
  return postRequest("/miniapp/login", { code });
};

export const fetchIsUserAdmin = () => {
  return getRequest("/miniapp/isUserAdmin", {});
};

export const refreshToken = (refreshToken: string) => {
  return postRequest("/miniapp/refresh", { refreshToken }, true);
};
