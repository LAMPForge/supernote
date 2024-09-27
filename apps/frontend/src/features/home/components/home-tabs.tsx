import { Text, Tabs, Space } from "@mantine/core";
import {IconClockHour3} from "@tabler/icons-react";

export default function HomeTabs() {
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
        <Text size="sm">Recent</Text>
      </Tabs.Panel>
    </Tabs>
  )
}