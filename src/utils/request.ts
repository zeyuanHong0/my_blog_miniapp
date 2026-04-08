import useUserStore from "@/store/user";

interface RequestConfig {
  method:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT"
    | undefined;
  url: string;
  data: any;
  contentType: any;
  isRefreshRequest: boolean; // 是否是刷新 token 的请求
  _retryCount?: number; // 重试次数
}

const baseUrl = import.meta.env.VITE_APP_BASE_API;

const MAX_RETRY = 1; // 最大重试次数
let isRefreshing = false; // 是否正在刷新 token
let requestQueue = [] as any[]; // 请求队列

export function uniPromise(config: RequestConfig): Promise<any> {
  return new Promise(function (resolve, reject) {
    const { method, url, data, contentType, isRefreshRequest } = config;
    const userStore = useUserStore();
    let token: string = "";
    if (userStore.access_token) {
      token = `Bearer ${userStore.access_token}`;
    }
    if (isRefreshRequest && userStore.refresh_token) {
      token = `Bearer ${userStore.refresh_token}`;
    }

    uni.request({
      url: url,
      method: method,
      data: data,
      header: {
        "Content-Type": contentType,
        "cache-control": "no-cache",
        Authorization: token,
      },
      success(res: any) {
        // console.log(res);
        // 请求失败
        if (res.statusCode !== 200) {
          const { code } = res.data;
          if (res.statusCode === 401 && (code === 401001 || code === 401002)) {
            // token 无效或过期，尝试刷新 token
            const retryCount = config._retryCount || 0;
            if (retryCount >= MAX_RETRY) {
              // 最大重试次数，直接重新登录
              forceReLogin(userStore);
              reject(res.data);
              return;
            }
            handleRefresh(
              { ...config, _retryCount: retryCount + 1 },
              resolve,
              reject,
            );
          } else if (
            res.statusCode === 401 &&
            (code === 401003 || code === 401004)
          ) {
            // 刷新 token 失败，重新登录
            forceReLogin(userStore);
            reject(res.data);
          } else {
            uni.showModal({
              title: "提示",
              content: res.data.message,
              showCancel: false,
            });
            reject(res.data);
          }
        } else {
          resolve(res.data);
        }
      },
      fail(res: any) {
        uni.showToast({
          title: "服务器暂时无法连接",
          icon: "loading",
          duration: 2000,
        });
        reject(res.data);
      },
    });
  });
}

async function handleRefresh(config: RequestConfig, resolve: any, reject: any) {
  const userStore = useUserStore();
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      await userStore.refreshToken();
      // 重新发起当前请求
      resolve(uniPromise(config));
      // 处理请求队列中的请求
      requestQueue.forEach(({ resolve: res, config: cfg }) =>
        res(uniPromise(cfg)),
      );
    } catch (error) {
      reject(error);
      requestQueue.forEach(({ reject: rej }) => rej(error));
    } finally {
      requestQueue = [];
      isRefreshing = false;
    }
  } else {
    requestQueue.push({ resolve, reject, config });
  }
}

function forceReLogin(userStore: ReturnType<typeof useUserStore>) {
  uni.showModal({
    title: "提示",
    content: "登录状态已过期，自动重新登录",
    showCancel: false,
    success: () => {
      userStore.access_token = "";
      userStore.refresh_token = "";
      userStore.login();
    },
  });
}

export function getRequest(
  url: string,
  data: any,
  isRefreshRequest: boolean = false,
): Promise<any> {
  return uniPromise({
    method: "GET",
    url: `${baseUrl}${url}`,
    data: data,
    contentType: "application/x-www-form-urlencoded;charset=utf8",
    isRefreshRequest: isRefreshRequest,
  });
}

export function postRequest(
  url: string,
  data: any,
  isRefreshRequest: boolean = false,
): Promise<any> {
  return uniPromise({
    method: "POST",
    url: `${baseUrl}${url}`,
    data: data,
    contentType: "application/json",
    isRefreshRequest: isRefreshRequest,
  });
}
