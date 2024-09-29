import classes from "./page-header.module.css";
import { Group } from "@mantine/core";
import Breadcrumb from '../breadcrumb/breadcrumb.tsx';
import PageHeaderMenu from './page-header-menu.tsx';

interface Props {
  readOnly?: boolean;
}
export default function PageHeader({ readOnly }: Props) {
  return (
    <div className={classes.header}>
      <Group justify="space-between" h="100%" px="md" wrap="nowrap">
        <Breadcrumb />

        <Group justify="flex-end" h="100%" px="md" wrap="nowrap">
          <PageHeaderMenu readOnly={readOnly} />
        </Group>
      </Group>
    </div>
  );
}
