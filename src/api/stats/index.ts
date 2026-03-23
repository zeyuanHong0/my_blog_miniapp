import { getRequest } from "@/utils/request";

// 获取博客相关统计数据
export function getBlogStats(): Promise<any> {
  return getRequest("/stats/blog", {});
}
