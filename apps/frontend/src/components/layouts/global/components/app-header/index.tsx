import { useAtom } from 'jotai';
import { desktopSidebarAtom, mobileSidebarAtom } from '../../atoms/sidebar-atom.ts';
import { useToggleSidebar } from '../../hooks/use-toggle-sidebar.ts';
import APP_ROUTE from '../../../../../libs/app-route.ts';
import { Link } from 'react-router-dom';
import classes from './style.module.css';
import { Group, Text } from '@mantine/core';
import SidebarToggle from '../../../../ui/sidebar-toggle-button';
import TopMenu from '../top-menu';

const links = [{ link: APP_ROUTE.HOME, label: "Home" }];

export function AppHeader() {
  const [mobileOpened] = useAtom(mobileSidebarAtom);
  const toggleMobile = useToggleSidebar(mobileSidebarAtom);

  const [desktopOpened] = useAtom(desktopSidebarAtom);
  const toggleDesktop = useToggleSidebar(desktopSidebarAtom);

  const isHomeRoute = location.pathname.startsWith("/home");

  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <>
      <Group h="100%" px="md" justify="space-between" wrap={"nowrap"}>
        <Group wrap="nowrap">
          {!isHomeRoute && (
            <>
              <SidebarToggle
                aria-label="sidebar toggle"
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />

              <SidebarToggle
                aria-label="sidebar toggle"
                opened={desktopOpened}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
            </>
          )}

          <Text
            size="lg"
            fw={600}
            style={{ cursor: "pointer", userSelect: "none" }}
            component={Link}
            to="/home"
          >
            SuperNote
          </Text>

          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
        </Group>

        <Group px={"xl"}>
          <TopMenu />
        </Group>
      </Group>
    </>
  );
}