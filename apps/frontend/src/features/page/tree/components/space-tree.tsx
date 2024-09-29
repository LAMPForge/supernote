import { atom, useAtom } from 'jotai';
import { OpenMap } from 'react-arborist/dist/main/state/open-slice';
import { useNavigate, useParams } from 'react-router-dom';
import { NodeApi, NodeRendererProps, Tree, TreeApi } from 'react-arborist';
import { SpaceTreeNode } from '../types.ts';
import { useEffect, useRef } from 'react';
import { useElementSize, useMergedRef } from '@mantine/hooks';
import classes from './space-tree.module.css';
import { useTreeMutation } from '../hooks/use-tree-mutation.ts';
import { treeApiAtom } from '../atoms/tree-api-atom.ts';
import clsx from 'clsx';
import PageArrow from './page-arrow.tsx';
import NodeMenu from './node-menu.tsx';
import CreateNode from './create-node.tsx';
import { treeDataAtom } from '../atoms/tree-data-atom.ts';
import { queryClient } from '../../../../main.tsx';
import { buildPageUrl } from '../../page.utils.ts';
import { IPage, SidebarPagesParams } from '../../types/page.types.ts';
import { fetchAncestorChildren, useGetRootSidebarPagesQuery, useGetSidebarPagesQuery, usePageQuery } from '../../queries/page-query.ts';
import { appendNodeChildren, buildTree, buildTreeWithChildren } from '../tree.utils.ts';
import { getPageBreadcrumbs, getSidebarPages } from '../../services/page-service.ts';
import { extractPageSlugId } from '../../../../libs/utils.ts';
import { dfs } from 'react-arborist/dist/main/utils';

interface SpaceTreeProps {
  spaceId: string;
  readOnly: boolean;
}

const openTreeNodesAtom = atom<OpenMap>({});

export default function SpaceTree({ spaceId, readOnly }: SpaceTreeProps) {
  const { pageSlug } = useParams();
  const { data, setData, controllers } = useTreeMutation<TreeApi<SpaceTreeNode>>(spaceId);
  const {
    data: pagesData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useGetRootSidebarPagesQuery({
    spaceId,
  });
  const [, setTreeApi] = useAtom<TreeApi<SpaceTreeNode>>(treeApiAtom);
  const treeApiRef = useRef<TreeApi<SpaceTreeNode>>();
  const [openTreeNodes, setOpenTreeNodes] = useAtom<OpenMap>(openTreeNodesAtom);
  const rootElement = useRef<HTMLDivElement>();
  const { ref: sizeRef, width, height } = useElementSize();
  const mergedRef = useMergedRef(rootElement, sizeRef);
  const isDataLoaded = useRef(false);
  const { data: currentPage } = usePageQuery({
    pageId: extractPageSlugId(pageSlug),
  });

  useEffect(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, isFetching, spaceId]);

  useEffect(() => {
    if (pagesData?.pages && !hasNextPage) {
      const allItems = pagesData.pages.flatMap((page) => page.items);
      const treeData = buildTree(allItems);

      if (data.length < 1 || data?.[0].spaceId !== spaceId) {
        setData(treeData);
        isDataLoaded.current = true;
        setOpenTreeNodes({});
      }
    }
  }, [pagesData, hasNextPage]);

  useEffect(() => {
    const fetchData = async () => {
      if (isDataLoaded.current && currentPage) {
        // @ts-ignore
        const node = dfs(treeApiRef.current?.root, currentPage.id);
        if (node) {
          return;
        }

        if (!currentPage.id) return;
        const ancestors = await getPageBreadcrumbs(currentPage.id);

        if (ancestors && ancestors?.length > 1) {
          let flatTreeItems = [...buildTree(ancestors)];

          const fetchAndUpdateChildren = async (ancestor: IPage) => {
            // we don't want to fetch the children of the opened page
            if (ancestor.id === currentPage.id) {
              return;
            }
            const children = await fetchAncestorChildren({
              pageId: ancestor.id,
              spaceId: ancestor.spaceId,
            });

            flatTreeItems = [
              ...flatTreeItems,
              ...children.filter(
                (child) => !flatTreeItems.some((item) => item.id === child.id),
              ),
            ];
          };

          const fetchPromises = ancestors.map((ancestor) =>
            fetchAndUpdateChildren(ancestor),
          );

          Promise.all(fetchPromises).then(() => {
            const ancestorsTree = buildTreeWithChildren(flatTreeItems);
            const rootChild = ancestorsTree[0];

            const updatedTree = appendNodeChildren(
              data,
              rootChild.id,
              rootChild.children,
            );
            setData(updatedTree);

            setTimeout(() => {
              treeApiRef.current.select(currentPage.id);
            }, 100);
          });
        }
      }
    };

    fetchData();
  }, [isDataLoaded.current, currentPage?.id]);

  useEffect(() => {
    if (currentPage?.id) {
      setTimeout(() => {
        treeApiRef.current?.select(currentPage.id, { align: "auto" });
      }, 200);
    } else {
      treeApiRef.current?.deselectAll();
    }
  }, [currentPage?.id]);

  useEffect(() => {
    if (treeApiRef.current) {
      // @ts-ignore
      setTreeApi(treeApiRef.current);
    }
  }, [treeApiRef.current]);

  return (
    <div className={classes.treeContainer} ref={mergedRef}>
      {rootElement.current && (
        <Tree
          data={data}
          disableDrag={readOnly}
          disableDrop={readOnly}
          disableEdit={readOnly}
          {...controllers}
          width={width}
          height={height}
          ref={treeApiRef}
          openByDefault={false}
          disableMultiSelection={true}
          className={classes.tree}
          rowClassName={classes.row}
          rowHeight={30}
          overscanCount={10}
          dndRootElement={rootElement.current}
          onToggle={() => {
            setOpenTreeNodes(treeApiRef.current.openState);
          }}
          initialOpenState={openTreeNodes}
        >
          {Node}
        </Tree>
      )}
    </div>
  )
}

function Node({ node, style, dragHandle, tree }: NodeRendererProps<any>) {
  const navigate = useNavigate();
  const [treeData, setTreeData] = useAtom(treeDataAtom);
  const { spaceSlug } = useParams();
  async function handleLoadChildren(node: NodeApi<SpaceTreeNode>) {
    if (!node.data.hasChildren) return;
    if (node.data.children && node.data.children.length > 0) {
      return;
    }

    try {
      const params: SidebarPagesParams = {
        pageId: node.data.id,
        spaceId: node.data.spaceId,
      };

      const newChildren = await queryClient.fetchQuery({
        queryKey: ["sidebar-pages", params],
        queryFn: () => getSidebarPages(params),
        staleTime: 10 * 60 * 1000,
      });

      const childrenTree = buildTree(newChildren.items);
      const updatedTreeData = appendNodeChildren(
        treeData,
        node.data.id,
        childrenTree,
      );

      setTreeData(updatedTreeData);
    } catch (error) {
      console.error("Failed to fetch children:", error);
    }
  }

  const handleClick = () => {
    const pageUrl = buildPageUrl(spaceSlug, node.data.slugId, node.data.name);
    navigate(pageUrl);
  };

  if (
    node.willReceiveDrop &&
    node.isClosed &&
    (node.children.length > 0 || node.data.hasChildren)
  ) {
    handleLoadChildren(node);
    setTimeout(() => {
      if (node.state.willReceiveDrop) {
        node.open();
      }
    }, 650);
  }

  return (
    <div
      style={style}
      className={clsx(classes.node, node.state)}
      ref={dragHandle}
      onClick={handleClick}
    >
      <PageArrow node={node} onExpandTree={() => handleLoadChildren(node)} />

      <span className={classes.text}>{node.data.name || "untitled"}</span>

      <div className={classes.actions}>
        <NodeMenu node={node} treeApi={tree} />
        {!tree.props.disableEdit && (
          <CreateNode
            node={node}
            treeApi={tree}
            onExpandTree={() => handleLoadChildren(node)}
          />
        )}
      </div>
    </div>
  );
}