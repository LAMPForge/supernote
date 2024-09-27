export enum JwtType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export type JwtPayload = {
  sub: string;
  email: string;
  workspaceId: string;
  type: JwtType.ACCESS;
};

export type JwtRefreshPayload = {
  sub: string;
  workspaceId: string;
  type: JwtType.REFRESH;
};
