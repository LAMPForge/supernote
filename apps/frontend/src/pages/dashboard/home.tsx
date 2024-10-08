import { Container, Space } from "@mantine/core";
import HomeTabs from "../../features/home/components/home-tabs.tsx";
import SpaceGrid from '../../features/space/components/space-grid';

export default function Home() {
  return (
    <Container size={"800"} pt="xl">
      <SpaceGrid />
      <Space h="xl" />
      <HomeTabs />
    </Container>
  )
}