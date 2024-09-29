import { Text, Avatar, SimpleGrid, Card, rem } from "@mantine/core";
import { useGetSpacesQuery } from '../../queries/space-query.ts';
import { Link } from 'react-router-dom';
import { getSpaceUrl } from '../../../../libs/config.ts';
import classes from './style.module.css';
import { formatMemberCount } from '../../../../libs/utils.ts';


export default function SpaceGrid() {
  const { data } = useGetSpacesQuery();

  const cards = data?.items.map((space) => (
    <Card
      key={space.id}
      p="xs"
      radius="md"
      component={Link}
      to={getSpaceUrl(space.slug)}
      className={classes.card}
      withBorder
    >
      <Card.Section className={classes.cardSection} h={40}></Card.Section>
      <Avatar
        name={space.name}
        color="initials"
        variant="filled"
        size="md"
        mt={rem(-20)}
      />

      <Text fz="md" fw={500} mt="xs" className={classes.title}>
        {space.name}
      </Text>

      <Text c="dimmed" size="xs" fw={700} mt="md">
        {formatMemberCount(space.memberCount)}
      </Text>
    </Card>
  ));

  return (
    <>
      <Text fz="sm" fw={500} mb={"md"}>
        Spaces you belong to
      </Text>

      <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }}>{cards}</SimpleGrid>
    </>
  );
}
