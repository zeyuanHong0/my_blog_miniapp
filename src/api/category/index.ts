import { getRequest } from "@/utils/request";

// 获取所有分类的数量
export function getCategoryCount(): Promise<any> {
  return getRequest("/miniapp/category/getCategoryCount", {});
}
