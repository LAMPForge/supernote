import { IPagination, QueryParams } from '../../../libs/types.ts';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ISpace } from '../types/space.types.ts';
import { getSpaceById, getSpaces } from '../services/space-service.ts';

export function useGetSpacesQuery(
  params?: QueryParams
): UseQueryResult<IPagination<ISpace>, Error> {
  return useQuery({
    queryKey: ['spaces', params],
    queryFn: () => getSpaces(params),
  });
}

export function useGetSpaceBySlugQuery(
  spaceId: string
): UseQueryResult<ISpace, Error> {
  return useQuery({
    queryKey: ['spaces', spaceId],
    queryFn: () => getSpaceById(spaceId),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000,
  });
}
