import {Outlet} from "react-router-dom";
import {UserProvider} from "../../../features/user/user-provider";

export default function Layout() {
  return (
    <UserProvider>
       <Outlet />
    </UserProvider>
  );
}