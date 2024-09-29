import { ILogin, ISetupWorkspace, ITokenResponse } from '../types/auth.types.ts';
import api from '../../../libs/api-client.ts';

export async function login(data: ILogin): Promise<ITokenResponse> {
  const response = await api.post<ITokenResponse>('/auth/login', data);
  return response.data;
}

export async function setupWorkspace(data: ISetupWorkspace): Promise<ITokenResponse> {
  const response = await api.post<ITokenResponse>('/auth/setup', data);
  return response.data;
}
