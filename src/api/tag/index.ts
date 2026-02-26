import { getRequest } from "@/utils/request";

// 获取标签总数量
export function getTagCount(): Promise<any> {
  return getRequest("/miniapp/tag/getTagCount", {});
}