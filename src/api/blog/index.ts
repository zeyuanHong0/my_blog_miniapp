import { getRequest } from "@/utils/request";

// 获取博客列表（最新的四个）
export function getLatestBlogList(num: number = 4): Promise<any> {
  return getRequest("/miniapp/blog/getLatestBlogList", {
    num,
  });
}

// 获取所有博客的总数
export function getTotalBlogCount(): Promise<any> {
  return getRequest("/miniapp/blog/getBlogCount", {});
}

// 获取所有博客列表
export function getAllBlogList(): Promise<any> {
  return getRequest("/miniapp/blog/getAllBlogList", {});
}
