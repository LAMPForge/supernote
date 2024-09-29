import { IWorkspace } from '../types/workspace.types.ts';
import api from '../../../libs/api-client.ts';

export async function getWorkspace(): Promise<IWorkspace> {
  const req = await api.post<IWorkspace>("/workspace/info");
  return req.data;
}

export async function getWorkspacePublicData(): Promise<IWorkspace> {
  const req = await api.post<IWorkspace>("/workspace/public");
  return req.data;
}
