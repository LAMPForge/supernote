import { IPagination, QueryParams } from '../../../libs/types';
import { ISpace } from '../types/space.types';
import api from '../../../libs/api-client';

export async function getSpaces(params?: QueryParams): Promise<IPagination<ISpace>> {
  const req = await api.post("/spaces", params);
  return req.data;
}

export async function getSpaceById(spaceId: string): Promise<ISpace> {
  const req = await api.post<ISpace>('/spaces/info', { spaceId });
  return req.data;
}
