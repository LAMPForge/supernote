import { Text, Tabs, Space } from "@mantine/core";
import { IconClockHour3 } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useGetSpaceBySlugQuery } from '../../queries/space-query.ts';
import RecentChanges from "../../../../components/common/recent-changes.tsx";

export default function SpaceHomeTabs() {
  const { spaceSlug } = useParams();
  const { data: space } = useGetSpaceBySlugQuery(spaceSlug);

  return (
    <Tabs defaultValue="recent">
      <Tabs.List>
        <Tabs.Tab value="recent" leftSection={<IconClockHour3 size={18} />}>
          <Text size="sm" fw={500}>
            Recently updated
          </Text>
        </Tabs.Tab>
      </Tabs.List>

      <Space my="md" />
      <Tabs.Panel value="recent">
        {space?.id && <RecentChanges spaceId={space.id} />}
      </Tabs.Panel>
    </Tabs>
  );
}
