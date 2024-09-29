import { useParams } from 'react-router-dom';
import { usePageQuery } from '../../features/page/queries/page-query.ts';
import { extractPageSlugId } from '../../libs/utils.ts';
import { useGetSpaceBySlugQuery } from '../../features/space/queries/space-query.ts';
import { useMemo } from 'react';
import { useSpaceAbility } from '../../features/space/permissions/use-space-ability.ts';
import { Helmet } from 'react-helmet-async';
import { SpaceCaslAction, SpaceCaslSubject } from '../../features/space/permissions/permissions.types.ts';
import PageHeader from '../../features/page/components/header/page-header.tsx';

export default function Page() {
  const { pageSlug } = useParams();
  const {
    data: page,
    isLoading,
    isError,
  } = usePageQuery({ pageId: extractPageSlugId(pageSlug) });
  const { data: space } = useGetSpaceBySlugQuery(page?.space?.slug);

  const spaceRules = space?.membership?.permissions;
  const spaceAbility = useMemo(() => useSpaceAbility(spaceRules), [spaceRules]);

  if (isLoading) {
    return <></>;
  }

  if (isError || !page) {
    return <div>Error fetching page data.</div>;
  }

  if (!space) {
    return <></>;
  }

  return (
    page && (
      <div>
        <Helmet>
          <title>{`${page?.icon || ""}  ${page?.title || "untitled"}`}</title>
        </Helmet>

        <PageHeader
          readOnly={spaceAbility.cannot(
            SpaceCaslAction.Manage,
            SpaceCaslSubject.Page,
          )}
        />
      </div>
    )
  );
}