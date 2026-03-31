import { postRequest, getRequest } from "@/utils/request";

interface updateStatus {
  is_online: number;
  status_text: string;
  status_desc: string;
}

// 更改状态
export const changeStatus = (data: updateStatus) => {
  return postRequest("/status/update", data);
};

// 获取状态
export const getStatus = () => {
  return getRequest("/status/getStatus", {});
};
