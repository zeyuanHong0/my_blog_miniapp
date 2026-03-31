import useUserStore from "@/store/user";

const is_dev = true; // 是否开发环境
const baseUrl = is_dev
  ? "http://127.0.0.1:3000/api" // 开发环境使用本地服务器地址
  : "https://www.zlyhub.com/api"; // 生产环境使用正式服务器地址

export function uniPromise(
  method:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT"
    | undefined,
  url: string,
  data: any,
  contentType: any,
): Promise<any> {
  const userStore = useUserStore();
  let token: string = "";
  if (userStore.token) {
    token = `Bearer ${userStore.token}`;
  }
  return new Promise(function (resolve, reject) {
    uni.request({
      url: url,
      method: method,
      data: data,
      header: {
        "Content-Type": contentType,
        "cache-control": "no-cache",
        Authorization: token,
      },
      async success(res: any) {
        // 请求失败
        if (res.statusCode !== 200) {
          uni.showModal({
            title: "提示",
            content: res.errMsg,
            showCancel: false,
          });
          reject(res.data);
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

export function getRequest(url: string, data: any): Promise<any> {
  return uniPromise(
    "GET",
    `${baseUrl}${url}`,
    data,
    "application/x-www-form-urlencoded;charset=utf8",
  );
}

export function postRequest(url: string, data: any): Promise<any> {
  return uniPromise("POST", `${baseUrl}${url}`, data, "application/json");
}
