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
      // console.log("🚀 ~ extractHeadings ~ text:", text);
      const level = levelArr.indexOf(child.attrs.class) + 1;
      headings.push({
        level,
        text,
        id: `${level}-${text}`,
      });
      child.attrs.id = `${level}-${text}`;
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

// 格式化 SVG 图标
export const formatSvgIcon = (iconStr: string) => {
  if (!iconStr) return '';
  // 如果是网络地址格式或已经是 data URI 格式，直接返回
  if (iconStr.startsWith('http') || iconStr.startsWith('data:')) {
    return iconStr;
  }
  // 如果后端返回的是纯粹的 <svg>...</svg> 文本代码，需要转码
  if (iconStr.includes('<svg')) {
    // 过滤掉不可见字符并转码
    const cleanSvg = iconStr.replace(/[\r\n\t]/g, '');
    return `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
  }
  return iconStr;
};
