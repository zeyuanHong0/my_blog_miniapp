import { getRequest } from "@/utils/request";

// 获取标签总数量
export function getTagCount(): Promise<any> {
  return getRequest("/miniapp/tag/getTagCount", {});
}

// 获取所有标签列表
export function getAllTags(): Promise<any> {
  return getRequest("/miniapp/tag/getAllTags", {});
}

// 获取标签详情
export function getTagInfo(id: string): Promise<any> {
  return getRequest(`/miniapp/tag/getTagInfo/${id}`, {});
}
