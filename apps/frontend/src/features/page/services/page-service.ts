import { IPagination } from '../../../libs/types.ts';
import api from '../../../libs/api-client.ts';
import { IPage } from '../types/page.types.ts';

export async function getRecentChanges(
  spaceId?: string,
): Promise<IPagination<IPage>> {
  const req = await api.post("/pages/recent", { spaceId });
  return req.data;
}
