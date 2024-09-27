import {ICurrentUser} from "../types/user.types";
import api from "../../../libs/api-client";

export async function getMyProfile() {
  const req = await api.post<ICurrentUser>("/user/me");
  return req.data as ICurrentUser;
}