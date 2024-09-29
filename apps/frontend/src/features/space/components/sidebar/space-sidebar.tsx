import { Link, useParams } from 'react-router-dom';
import { useGetSpaceBySlugQuery } from '../../queries/space-query';
import { useDisclosure } from '@mantine/hooks';
import classes from './space-sidebar.module.css';
import { SwitchSpace } from './switch-space.tsx';
import { UnstyledButton } from '@mantine/core';
import { getSpaceUrl } from '../../../../libs/config.ts';
import { IconHome, IconSearch, IconSettings } from '@tabler/icons-react';
import { spotlight } from '@mantine/spotlight';
import clsx from 'clsx';

export function SpaceSidebar() {
  const [
    opened,
    { open: openSettings, close: closeSettings }
  ] = useDisclosure(false);
  const { spaceSlug } = useParams();
  const { data: space, isLoading, isError } = useGetSpaceBySlugQuery(spaceSlug);

  if (!space) {
    return <></>;
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
          </div>
        </div>
      </div>
    </>
  );
}