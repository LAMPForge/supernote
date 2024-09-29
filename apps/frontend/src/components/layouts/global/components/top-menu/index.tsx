import { Group, Menu, UnstyledButton, Text } from "@mantine/core";
import {
  IconBrush,
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import { currentUserAtom } from "@/features/user/atoms/current-user-atom.ts";
import { Link } from "react-router-dom";
import useAuth from "@/features/auth/hooks/use-auth.ts";
import APP_ROUTE from '../../../../../libs/app-route.ts';

export default function TopMenu() {
  const [currentUser] = useAtom(currentUserAtom);
  const { logout } = useAuth();

  const user = currentUser?.user;
  const workspace = currentUser?.workspace;

  if (!user || !workspace) {
    return <></>;
  }

  return (
    <Menu width={250} position="bottom-end" withArrow shadow={"lg"}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7} wrap={"nowrap"}>
            {/*<CustomAvatar*/}
            {/*  avatarUrl={workspace.logo}*/}
            {/*  name={workspace.name}*/}
            {/*  variant="filled"*/}
            {/*  size="sm"*/}
            {/*/>*/}
            <Text fw={500} size="sm" lh={1} mr={3}>
              {workspace.name}
            </Text>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Divider />
        <Menu.Item onClick={logout} leftSection={<IconLogout size={16} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
