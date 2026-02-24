import { getRequest } from "@/utils/request";

// 获取博客列表（最新的四个）
export function getLatestBlogList(num: number = 4): Promise<any> {
  return getRequest("/miniapp/blog/getLatestBlogList", {
    num,
  });
}
