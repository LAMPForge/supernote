import { NodeApi, TreeApi } from 'react-arborist';
import { SpaceTreeNode } from '../types.ts';
import { useClipboard } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { buildPageUrl } from '../../page.utils.ts';
import { notifications } from '@mantine/notifications';
import { ActionIcon, Menu, rem } from '@mantine/core';
import { IconDotsVertical, IconLink, IconTrash } from '@tabler/icons-react';

interface NodeMenuProps {
  node: NodeApi<SpaceTreeNode>;
  treeApi: TreeApi<SpaceTreeNode>;
}

export default function NodeMenu({ node, treeApi }: NodeMenuProps) {
  const clipboard = useClipboard({ timeout: 500 });
  const { spaceSlug } = useParams();

  const handleCopyLink = () => {
    const pageUrl = buildPageUrl(spaceSlug, node.data.slugId, node.data.name);
    clipboard.copy(pageUrl);
    notifications.show({ message: "Link copied" });
  };

  return (
    <Menu shadow={"md"} width={200}>
      <Menu.Target>
        <ActionIcon
          variant="transparent"
          c="gray"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <IconDotsVertical
            style={{ width: rem(20), height: rem(20) }}
            stroke={2}
          />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconLink style={{ width: rem(14), height: rem(14) }} />}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCopyLink();
          }}
        >
          Copy link
        </Menu.Item>

        {!(treeApi.props.disableEdit as boolean) && (
          <>
            <Menu.Divider />

            <Menu.Item
              c="red"
              leftSection={
                <IconTrash style={{ width: rem(14), height: rem(14) }} />
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Delete
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  )
}