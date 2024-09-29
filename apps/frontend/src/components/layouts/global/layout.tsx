import {Outlet} from "react-router-dom";
import {UserProvider} from "../../../features/user/user-provider";
import Index from './components/global-app-shell';

export default function Layout() {
  return (
    <UserProvider>
      <Index>
        <Outlet />
      </Index>
    </UserProvider>
  );
}