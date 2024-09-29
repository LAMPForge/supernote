import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { IWorkspace } from '../types/workspace.types';
import { getWorkspace, getWorkspacePublicData } from '../services/workspace-service';

export function useWorkspaceQuery(): UseQueryResult<IWorkspace, Error> {
  return useQuery({
    queryKey: ["workspace"],
    queryFn: () => getWorkspace(),
  });
}

export function useWorkspacePublicDataQuery(): UseQueryResult<
  IWorkspace,
  Error
> {
  return useQuery({
    queryKey: ["workspace-public"],
    queryFn: () => getWorkspacePublicData(),
  });
}
