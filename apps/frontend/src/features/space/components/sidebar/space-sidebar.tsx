import { Link, useParams } from 'react-router-dom';
import { useGetSpaceBySlugQuery } from '../../queries/space-query';
import { useDisclosure } from '@mantine/hooks';
import classes from './space-sidebar.module.css';
import { SwitchSpace } from './switch-space.tsx';
import { ActionIcon, Group, Menu, Tooltip, UnstyledButton, Text } from '@mantine/core';
import { getSpaceUrl } from '../../../../libs/config.ts';
import { IconArrowDown, IconDots, IconHome, IconPlus, IconSearch, IconSettings } from '@tabler/icons-react';
import { spotlight } from '@mantine/spotlight';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useSpaceAbility } from '../../permissions/use-space-ability.ts';
import { SpaceCaslAction, SpaceCaslSubject } from '../../permissions/permissions.types.ts';
import { useAtom } from 'jotai';
import { treeApiAtom } from '../../../page/tree/atoms/tree-api-atom.ts';

export function SpaceSidebar() {
  const [tree] = useAtom(treeApiAtom);
  const [
    opened,
    { open: openSettings, close: closeSettings }
  ] = useDisclosure(false);
  const { spaceSlug } = useParams();
  const { data: space, isLoading, isError } = useGetSpaceBySlugQuery(spaceSlug);

  const spaceRules = space?.membership?.permissions;
  const spaceAbility = useMemo(() => useSpaceAbility(spaceRules), [spaceRules]);

  if (!space) {
    return <></>;
  }

  function handleCreatePage() {
    tree?.create({ parentId: null, type: 'internal', index: 0 });
  }

  return (
    <>
      <div className={classes.navbar}>
        <div
          className={classes.section}
          style={{
            border: 'none',
            marginTop: 2,
            marginBottom: 3,
          }}
        >
          <SwitchSpace spaceName={space?.name} spaceSlug={space?.slug} />
        </div>
        <div className={classes.section}>
          <div className={classes.menuItems}>
            <UnstyledButton
              component={Link}
              to={getSpaceUrl(spaceSlug)}
              className={clsx(
                classes.menu,
                location.pathname.toLowerCase() === getSpaceUrl(spaceSlug)
                  ? classes.activeButton
                  : ''
              )}
            >
              <div className={classes.menuItemInner}>
                <IconHome
                  size={18}
                  className={classes.menuItemIcon}
                  stroke={2}
                />
                <span>Overview</span>
              </div>
            </UnstyledButton>

            <UnstyledButton className={classes.menu} onClick={spotlight.open}>
              <div className={classes.menuItemInner}>
                <IconSearch
                  size={18}
                  className={classes.menuItemIcon}
                  stroke={2}
                />
                <span>Search</span>
              </div>
            </UnstyledButton>

            <UnstyledButton className={classes.menu} onClick={openSettings}>
              <div className={classes.menuItemInner}>
                <IconSettings
                  size={18}
                  className={classes.menuItemIcon}
                  stroke={2}
                />
                <span>Space settings</span>
              </div>
            </UnstyledButton>

            {spaceAbility.can(
              SpaceCaslAction.Manage,
              SpaceCaslSubject.Page
            ) && (
              <UnstyledButton
                className={classes.menu}
                onClick={handleCreatePage}
              >
                <div className={classes.menuItemInner}>
                  <IconPlus
                    size={18}
                    className={classes.menuItemIcon}
                    stroke={2}
                  />
                  <span>New page</span>
                </div>
              </UnstyledButton>
            )}
          </div>
        </div>

        <div className={classes.section}>
          <Group className={classes.pagesHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              Pages
            </Text>

            {spaceAbility.can(
              SpaceCaslAction.Manage,
              SpaceCaslSubject.Page
            ) && (
              <Group gap="xs">
                <SpaceMenu spaceId={space.id} onSpaceSettings={openSettings} />

                <Tooltip label="Create page" withArrow position="right">
                  <ActionIcon
                    variant="default"
                    size={18}
                    onClick={handleCreatePage}
                    aria-label="Create page"
                  >
                    <IconPlus />
                  </ActionIcon>
                </Tooltip>
              </Group>
            )}
          </Group>

          <div className={classes.pages}>
          </div>
        </div>
      </div>
    </>
  );
}


interface SpaceMenuProps {
  spaceId: string;
  onSpaceSettings: () => void;
}
function SpaceMenu({ spaceId, onSpaceSettings }: SpaceMenuProps) {
  const [importOpened, { open: openImportModal, close: closeImportModal }] =
    useDisclosure(false);

  return (
    <>
      <Menu width={200} shadow="md" withArrow>
        <Menu.Target>
          <Tooltip
            label="Import pages & space settings"
            withArrow
            position="top"
          >
            <ActionIcon variant="default" size={18} aria-label="Space menu">
              <IconDots />
            </ActionIcon>
          </Tooltip>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={openImportModal}
            leftSection={<IconArrowDown size={16} />}
          >
            Import pages
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            onClick={onSpaceSettings}
            leftSection={<IconSettings size={16} />}
          >
            Space settings
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
