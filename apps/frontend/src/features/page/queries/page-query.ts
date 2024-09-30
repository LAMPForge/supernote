import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { IPagination } from '../../../libs/types';
import { IPage, IPageInput, SidebarPagesParams } from '../types/page.types';
import { createPage, getPageById, getRecentChanges, getSidebarPages, updatePage } from '../services/page-service';
import { notifications } from '@mantine/notifications';
import { queryClient } from '../../../main.tsx';
import { buildTree } from '../tree/tree.utils.ts';

export function useRecentChangesQuery(
  spaceId?: string,
): UseQueryResult<IPagination<IPage>, Error> {
  return useQuery({
    queryKey: ["recent-changes", spaceId],
    queryFn: () => getRecentChanges(spaceId),
    refetchOnMount: true,
  });
}

export function useCreatePageMutation() {
  return useMutation<IPage, Error, Partial<IPageInput>>({
    mutationFn: (data) => createPage(data),
    onSuccess: (data) => {},
    onError: (error) => {
      notifications.show({ message: "Failed to create page", color: "red" });
    },
  });
}

export function useGetSidebarPagesQuery(
  data: SidebarPagesParams,
): UseQueryResult<IPagination<IPage>, Error> {
  return useQuery({
    queryKey: ["sidebar-pages", data],
    queryFn: () => getSidebarPages(data),
    staleTime: 10 * 60 * 1000,
  });
}

export function useGetRootSidebarPagesQuery(data: SidebarPagesParams) {
  return useInfiniteQuery({
    queryKey: ["root-sidebar-pages", data.spaceId],
    queryFn: async ({ pageParam }) => {
      return getSidebarPages({ spaceId: data.spaceId, page: pageParam });
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) =>
      firstPage.meta.hasPrevPage ? firstPage.meta.page - 1 : undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function usePageQuery(
  pageInput: Partial<IPageInput>,
): UseQueryResult<IPage, Error> {
  return useQuery({
    queryKey: ["pages", pageInput.pageId],
    queryFn: () => getPageById(pageInput),
    enabled: !!pageInput.pageId,
    staleTime: 5 * 60 * 1000,
  });
}

export async function fetchAncestorChildren(params: SidebarPagesParams) {
  const response = await queryClient.fetchQuery({
    queryKey: ["sidebar-pages", params],
    queryFn: () => getSidebarPages(params),
    staleTime: 30 * 60 * 1000,
  });
  return buildTree(response.items);
}

export function useUpdatePageMutation() {
  const queryClient = useQueryClient();

  return useMutation<IPage, Error, Partial<IPageInput>>({
    mutationFn: (data) => updatePage(data),
    onSuccess: (data) => {
      const pageBySlug = queryClient.getQueryData<IPage>([
        "pages",
        data.slugId,
      ]);
      const pageById = queryClient.getQueryData<IPage>(["pages", data.id]);

      if (pageBySlug) {
        queryClient.setQueryData(["pages", data.slugId], {
          ...pageBySlug,
          ...data,
        });
      }

      if (pageById) {
        queryClient.setQueryData(["pages", data.id], { ...pageById, ...data });
      }
    },
  });
}
