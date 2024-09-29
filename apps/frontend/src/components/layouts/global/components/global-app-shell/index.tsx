import React from 'react';
import { AppShell, Container } from '@mantine/core';
import { useAtom } from 'jotai';
import { asideStateAtom, desktopSidebarAtom, mobileSidebarAtom } from '../../atoms/sidebar-atom.ts';
import { useLocation } from 'react-router-dom';
import classes from "./style.module.css";
import { AppHeader } from '../app-header';
import { SpaceSidebar } from '../../../../../features/space/components/sidebar/space-sidebar.tsx';

export default function GlobalAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpened] = useAtom(mobileSidebarAtom);
  const [desktopOpened] = useAtom(desktopSidebarAtom);
  const [{ isAsideOpen }] = useAtom(asideStateAtom);

  const location = useLocation();
  const isSettingsRoute = location.pathname.startsWith("/settings");
  const isSpaceRoute = location.pathname.startsWith("/s/");
  const isHomeRoute = location.pathname.startsWith("/home");
  const isPageRoute = location.pathname.includes("/p/");

  return (
    <AppShell
      header={{ height: 45 }}
      padding="md"
      navbar={
        !isHomeRoute && {
          width: 300,
          breakpoint: "sm",
          collapsed: {
            mobile: !mobileOpened,
            desktop: !desktopOpened,
          },
        }
      }
      aside={
        isPageRoute && {
          width: 350,
          breakpoint: "sm",
          collapsed: { mobile: !isAsideOpen, desktop: !isAsideOpen },
        }
      }
    >
      <AppShell.Header px="md" className={classes.header}>
        <AppHeader />
      </AppShell.Header>
      {!isHomeRoute && (
        <AppShell.Navbar className={classes.navbar} withBorder={false}>
          {isSpaceRoute && <SpaceSidebar />}
        </AppShell.Navbar>
      )}
      <AppShell.Main>
        {isSettingsRoute ? (
          <Container size={800}>{children}</Container>
        ) : (
          children
        )}
      </AppShell.Main>
    </AppShell>
  );
}