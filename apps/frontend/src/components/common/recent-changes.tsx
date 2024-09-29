import {
  Text,
  Group,
  UnstyledButton,
  Badge,
  Table,
  ScrollArea,
  ActionIcon,
} from '@mantine/core';
import PageListSkeleton from '../ui/page-list-skeleton.tsx';
import { useRecentChangesQuery } from '../../features/page/queries/page-query.ts';

interface Props {
  spaceId?: string;
}

export default function RecentChanges({ spaceId }: Props) {
  const { data: pages, isLoading, isError } = useRecentChangesQuery(spaceId);

  if (isLoading) {
    return <PageListSkeleton />;
  }

  if (isError) {
    return <Text>Failed to fetch recent pages</Text>;
  }

  return pages && pages.items.length > 0 ? (
    <ScrollArea>
    </ScrollArea>
  ) : (
    <Text size="md" ta="center">
      No pages yet
    </Text>
  );
}