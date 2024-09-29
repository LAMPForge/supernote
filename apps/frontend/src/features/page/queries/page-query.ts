import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IPagination } from '../../../libs/types';
import { IPage } from '../types/page.types';
import { getRecentChanges } from '../services/page-service';

export function useRecentChangesQuery(
  spaceId?: string,
): UseQueryResult<IPagination<IPage>, Error> {
  return useQuery({
    queryKey: ["recent-changes", spaceId],
    queryFn: () => getRecentChanges(spaceId),
    refetchOnMount: true,
  });
}
