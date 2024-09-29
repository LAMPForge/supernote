import { NodeApi } from 'react-arborist';
import { SpaceTreeNode } from '../types.ts';
import { ActionIcon } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconPointFilled } from '@tabler/icons-react';

interface PageArrowProps {
  node: NodeApi<SpaceTreeNode>;
  onExpandTree?: () => void;
}

export default function PageArrow({ node, onExpandTree }: PageArrowProps) {
  return (
    <ActionIcon
      size={20}
      variant="subtle"
      c="gray"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        node.toggle();
        onExpandTree();
      }}
    >
      {node.isInternal ? (
        node.children && (node.children.length > 0 || node.data.hasChildren) ? (
          node.isOpen ? (
            <IconChevronDown stroke={2} size={18} />
          ) : (
            <IconChevronRight stroke={2} size={18} />
          )
        ) : (
          <IconPointFilled size={8} />
        )
      ) : null}
    </ActionIcon>
  );
}
