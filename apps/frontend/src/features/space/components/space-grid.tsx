import { Text, Avatar, SimpleGrid, Card, rem } from "@mantine/core";

export default function SpaceGrid() {
  return (
    <>
      <Text fz="sm" fw={500} mb={"md"}>
        Spaces you belong to
      </Text>

      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }}></SimpleGrid>
    </>
  );
}