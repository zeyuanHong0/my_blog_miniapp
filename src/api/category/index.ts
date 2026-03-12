import { getRequest } from "@/utils/request";

// 获取所有分类的数量
export function getCategoryCount(): Promise<any> {
  return getRequest("/miniapp/category/getCategoryCount", {});
}

// 获取全部分类以及每个分类的文章数量
export function getAllCategories(): Promise<any> {
  return getRequest("/miniapp/category/getAllCategoryList", {});
}
