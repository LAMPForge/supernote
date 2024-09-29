import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useAtom } from "jotai";
import {currentUserAtom} from "../../user/atoms/current-user-atom.ts";
import { authTokensAtom } from '../atoms/auth-tokens-atom.ts';
import { ILogin, ISetupWorkspace } from '../types/auth.types.ts';
import APP_ROUTE from '../../../libs/app-route.ts';
import { notifications } from '@mantine/notifications';
import { login, setupWorkspace } from '../services/auth-service.ts';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const [_, setCurrentUser] = useAtom(currentUserAtom);
  const [authToken, setAuthToken] = useAtom(authTokensAtom);

  const handleLogin = async (data: ILogin) => {
    setIsLoading(true);

    try {
      const response = await login(data);
      setIsLoading(false);
      await setAuthToken(response.tokens);
      navigate(APP_ROUTE.HOME);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notifications.show({
        message: error.response?.data.message,
        color: "red",
      });
    }
  }

  const handleSetupWorkspace = async (data: ISetupWorkspace) => {
    setIsLoading(true);

    try {
      const response = await setupWorkspace(data);
      setIsLoading(false);
      setAuthToken(response.tokens);
      console.log("response", response.tokens);
      // navigate(APP_ROUTE.HOME);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      notifications.show({
        message: error.response?.data.message,
        color: "red",
      });
    }
  }

  const handleIsAuthenticated = async () => {
    if (!authToken) {
      return false;
    }

    try {
      const accessToken = authToken.accessToken;
      const payload = jwtDecode(accessToken);

      const now = Date.now().valueOf() / 1000;
      return payload.exp >= now;
    } catch (error) {
      console.log("Invalid JWT token", error);
      return false;
    }
  }

  const hasTokens = (): boolean => {
    return !!authToken;
  }

  const handleLogout = async () => {
    await setAuthToken(null);
    setCurrentUser(null);
    Cookies.remove("authTokens");
    navigate(APP_ROUTE.AUTH.LOGIN);
  }

  return {
    login: handleLogin,
    setupWorkspace: handleSetupWorkspace,
    isAuthenticated: handleIsAuthenticated,
    logout: handleLogout,
    hasTokens,
    isLoading,
  };
}
