export interface ILogin {
  email: string;
  password: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenResponse {
  tokens: ITokens;
}

export interface ISetupWorkspace {
  workspaceName: string;
  name: string;
  email: string;
  password: string;
}
