import { treeDataAtom } from '../../tree/atoms/tree-data-atom.ts';
import { useEffect, useState } from 'react';
import { SpaceTreeNode } from '../../tree/types.ts';
import { Link, useParams } from 'react-router-dom';
import { usePageQuery } from '../../queries/page-query.ts';
import { extractPageSlugId } from '../../../../libs/utils.ts';
import { useAtomValue } from "jotai";
import { ActionIcon, Anchor, Breadcrumbs, Button, Popover, Text } from '@mantine/core';
import { buildPageUrl } from '../../page.utils.ts';
import classes from "./breadcrumb.module.css";
import { IconDots } from '@tabler/icons-react';
import { findBreadcrumbPath } from '../../tree/tree.utils.ts';

function getTitle(name: string, icon: string) {
  if (icon) {
    return `${icon} ${name}`;
  }
  return name;
}

export default function Breadcrumb() {
  const treeData = useAtomValue(treeDataAtom);
  const [breadcrumbNodes, setBreadcrumbNodes] = useState<SpaceTreeNode[] | null>(null);
  const { pageSlug, spaceSlug } = useParams();
  const { data: currentPage } = usePageQuery({
    pageId: extractPageSlugId(pageSlug),
  });

  useEffect(() => {
    if (treeData?.length > 0 && currentPage) {
      const breadcrumb = findBreadcrumbPath(treeData, currentPage.id);
      setBreadcrumbNodes(breadcrumb || null);
    }
  }, [currentPage?.id, treeData]);

  const HiddenNodesTooltipContent = () =>
    breadcrumbNodes?.slice(1, -2).map((node) => (
      <Button.Group orientation="vertical" key={node.id}>
        <Button
          justify="start"
          component={Link}
          to={buildPageUrl(spaceSlug, node.slugId, node.name)}
          variant="default"
          style={{ border: "none" }}
        >
          <Text fz={"sm"} className={classes.truncatedText}>
            {getTitle(node.name, node.icon)}
          </Text>
        </Button>
      </Button.Group>
    ));

  const renderAnchor = (node: SpaceTreeNode) => (
    <Anchor
      component={Link}
      to={buildPageUrl(spaceSlug, node.slugId, node.name)}
      underline="never"
      fz={"sm"}
      key={node.id}
      className={classes.truncatedText}
    >
      {getTitle(node.name, node.icon)}
    </Anchor>
  );

  const getBreadcrumbItems = () => {
    if (!breadcrumbNodes) return [];

    if (breadcrumbNodes.length > 3) {
      const firstNode = breadcrumbNodes[0];
      const secondLastNode = breadcrumbNodes[breadcrumbNodes.length - 2];
      const lastNode = breadcrumbNodes[breadcrumbNodes.length - 1];

      return [
        renderAnchor(firstNode),
        <Popover
          width={250}
          position="bottom"
          withArrow
          shadow="xl"
          key="hidden-nodes"
        >
          <Popover.Target>
            <ActionIcon color="gray" variant="transparent">
              <IconDots size={20} stroke={2} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <HiddenNodesTooltipContent />
          </Popover.Dropdown>
        </Popover>,
        renderAnchor(secondLastNode),
        renderAnchor(lastNode),
      ];
    }

    return breadcrumbNodes.map(renderAnchor);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      {breadcrumbNodes && (
        <Breadcrumbs className={classes.breadcrumbs}>
          {getBreadcrumbItems()}
        </Breadcrumbs>
      )}
    </div>
  );
}