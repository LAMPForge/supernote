import * as React from "react";
import { useAtom } from "jotai";
import {currentUserAtom} from "./atoms/current-user-atom";
import useCurrentUser from "./hooks/use-current-user";
import {useEffect} from "react";

export function UserProvider({ children }: React.PropsWithChildren) {
  const [_, setCurrentUser] = useAtom(currentUserAtom);
  const {
    data,
    isLoading,
    error,
  } = useCurrentUser();

  useEffect(() => {
    if (data && data.user && data.workspace) {
      setCurrentUser(data);
    }
  }, [data, isLoading]);

  if (isLoading) return <></>

  if (
    !data?.user || !data?.workspace
  ) {
    return <></>
  }

  if (error) {
    return <>An error occurred</>;
  }

  return <>{children}</>;
}