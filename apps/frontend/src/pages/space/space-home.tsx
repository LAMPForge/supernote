import { Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useGetSpaceBySlugQuery } from '../../features/space/queries/space-query.ts';
import SpaceHomeTabs from '../../features/space/components/space-home-tabs';

export default function SpaceHome() {
  const { spaceSlug } = useParams();
  const { data: space } = useGetSpaceBySlugQuery(spaceSlug);

  return (
    <Container size={"800"} pt="xl">
      {space && <SpaceHomeTabs />}
    </Container>
  );
}
