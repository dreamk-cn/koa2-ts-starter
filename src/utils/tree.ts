/**
 * 扁平数组转树形结构
 * @param items 数据库查出来的扁平数组
 * @param idKey 主键名
 * @param parentIdKey 父节点字段名
 * @param childrenKey 子节点字段名
 */
export const listToTree = (items: any[], idKey = 'id', parentIdKey = 'parentId', childrenKey = 'children') => {
  const map: any = {};
  const tree: any[] = [];

  // 初始化 map
  items.forEach((item) => {
    map[item[idKey]] = { ...item, [childrenKey]: [] };
  });

  // 组装
  items.forEach((item) => {
    const node = map[item[idKey]];
    const parentId = item[parentIdKey];
    
    // 如果 parentId 为 0 或 null，或者是找不到父节点，视为根节点
    if (!parentId || parentId === 0 || !map[parentId]) {
      tree.push(node);
    } else {
      map[parentId][childrenKey].push(node);
    }
  });

  return tree;
};