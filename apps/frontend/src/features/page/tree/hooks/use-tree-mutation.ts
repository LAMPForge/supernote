import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { CreateHandler, SimpleTree } from 'react-arborist';
import { SpaceTreeNode } from '../types.ts';
import { treeDataAtom } from '../atoms/tree-data-atom.ts';
import { useCreatePageMutation } from '../../queries/page-query.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { IPage } from '../../types/page.types.ts';
import { buildPageUrl } from '../../page.utils.ts';

export function useTreeMutation<T>(spaceId: string) {
  const [data, setData] = useAtom(treeDataAtom);
  const tree = useMemo(() => new SimpleTree<SpaceTreeNode>(data), [data]);
  const createPageMutation = useCreatePageMutation();
  const navigate = useNavigate();
  const { spaceSlug } = useParams();

  const onCreate: CreateHandler<T> = async ({ parentId, index, type }) => {
    const payload: { spaceId: string; parentPageId?: string } = {
      spaceId: spaceId,
    };

    if (parentId) {
      payload.parentPageId = parentId;
    }

    let createdPage: IPage;
    try {
      createdPage = await createPageMutation.mutateAsync(payload);
    } catch (err) {
      throw new Error("Failed to create page");
    }

    const data = {
      id: createdPage.id,
      slugId: createdPage.slugId,
      name: "",
      position: createdPage.position,
      spaceId: createdPage.spaceId,
      parentPageId: createdPage.parentPageId,
      children: [],
    } as any;

    let lastIndex: number;
    if (parentId === null) {
      lastIndex = tree.data.length;
    } else {
      lastIndex = tree.find(parentId).children.length;
    }
    index = lastIndex;
    tree.create({ parentId, index, data });
    setData(tree.data);

    const pageUrl = buildPageUrl(
      spaceSlug,
      createdPage.slugId,
      createdPage.title,
    );
    navigate(pageUrl);
    return data;
  }

  const controllers = { onCreate };
  return { data, setData, controllers } as const;
}