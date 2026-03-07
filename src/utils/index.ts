// 手机震动
export const vibratePhone = (type?: "light" | "medium" | "heavy") => {
  uni.vibrateShort({
    type: type || "light",
  });
};

// 提取目录
export const extractHeadings = (node: any) => {}