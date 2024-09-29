import { IPage } from '../types/page.types.ts';
import { SpaceTreeNode } from './types.ts';

function sortPositionKeys(keys: any[]) {
  return keys.sort((a, b) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    return 0;
  });
}

export function buildTree(pages: IPage[]): SpaceTreeNode[] {
  const pageMap: Record<string, SpaceTreeNode> = {};

  const tree: SpaceTreeNode[] = [];

  pages.forEach((page) => {
    pageMap[page.id] = {
      id: page.id,
      slugId: page.slugId,
      name: page.title,
      icon: page.icon,
      position: page.position,
      hasChildren: page.hasChildren,
      spaceId: page.spaceId,
      parentPageId: page.parentPageId,
      children: [],
    };
  });

  pages.forEach((page) => {
    tree.push(pageMap[page.id]);
  });

  return sortPositionKeys(tree);
}

export function buildTreeWithChildren(items: SpaceTreeNode[]): SpaceTreeNode[] {
  const nodeMap = {};
  let result: SpaceTreeNode[] = [];

  items.forEach((item) => {
    nodeMap[item.id] = { ...item, children: [] };
  });

  items.forEach((item) => {
    const node = nodeMap[item.id];
    if (item.parentPageId !== null) {
      nodeMap[item.parentPageId].children.push(node);
    } else {
      result.push(node);
    }
  });

  result = sortPositionKeys(result);

  function sortChildren(node: SpaceTreeNode) {
    if (node.children.length > 0) {
      node.hasChildren = true;
      node.children = sortPositionKeys(node.children);
      node.children.forEach(sortChildren);
    }
  }

  result.forEach(sortChildren);

  return result;
}

export function appendNodeChildren(
  treeItems: SpaceTreeNode[],
  nodeId: string,
  children: SpaceTreeNode[],
) {
  return treeItems.map((nodeItem) => {
    if (nodeItem.id === nodeId) {
      return { ...nodeItem, children };
    }
    if (nodeItem.children) {
      return {
        ...nodeItem,
        children: appendNodeChildren(nodeItem.children, nodeId, children),
      };
    }
    return nodeItem;
  });
}

export function findBreadcrumbPath(
  tree: SpaceTreeNode[],
  pageId: string,
  path: SpaceTreeNode[] = [],
): SpaceTreeNode[] | null {
  for (const node of tree) {
    if (!node.name || node.name.trim() === "") {
      node.name = "untitled";
    }

    if (node.id === pageId) {
      return [...path, node];
    }

    if (node.children) {
      const newPath = findBreadcrumbPath(node.children, pageId, [
        ...path,
        node,
      ]);
      if (newPath) {
        return newPath;
      }
    }
  }
  return null;
}