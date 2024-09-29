import { ActionIcon, Tooltip } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';
import useToggleAside from '../../../../hooks/use-toggle-aside.ts';

interface PageHeaderMenuProps {
  readOnly?: boolean;
}

export default function PageHeaderMenu({ readOnly }: PageHeaderMenuProps) {
  const toggleAside = useToggleAside();

  return (
    <>
      <Tooltip label="Comments" openDelay={250} withArrow>
        <ActionIcon
          variant="default"
          style={{ border: "none" }}
          onClick={() => toggleAside("comments")}
        >
          <IconMessage size={20} stroke={2} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}