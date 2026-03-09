// 手机震动
export const vibratePhone = (type?: "light" | "medium" | "heavy") => {
  uni.vibrateShort({
    type: type || "light",
  });
};

// 提取目录
export const extractHeadings = (node: any) => {
  // console.log("提取目录", node);
  if (!node) return;
  const headings: any[] = [];
  const levelArr: string[] = [
    "h2w__h1",
    "h2w__h2",
    "h2w__h3",
    "h2w__h4",
    "h2w__h5",
    "h2w__h6",
  ];
  node.forEach((child: any) => {
    if (levelArr.includes(child?.attrs?.class)) {
      // 处理标题文本
      const text = extractTreeProperty(child, "children", "text").join("");
      console.log("🚀 ~ extractHeadings ~ text:", text);
      const level = levelArr.indexOf(child.attrs.class) + 1;
      headings.push({
        level,
        text,
        id: `${level}-${text}`,
      });
      // child.attrs = child.attrs || {};
      // child.attrs["data-id"] = `${level}-${text}`;
      // child.attrs = child.attrs || {};
      // child.attrs.data = `${level}-${text}`;
    }
  });
  return headings;
};

/**
 *
 * @param node - 当前节点
 * @param childrenKey - 子节点字段名
 * @param property - 要提取的属性
 */
export const extractTreeProperty = (
  node: any,
  childrenKey: string,
  property: string,
): any[] => {
  const result: any[] = [];
  const traverse = (currentNode: any) => {
    currentNode[childrenKey].forEach((child: any) => {
      if (child[childrenKey] && child[childrenKey].length > 0) {
        traverse(child);
      } else {
        if (child[property]) {
          result.push(child[property]);
        }
      }
    });
  };
  traverse(node);
  return result;
};
