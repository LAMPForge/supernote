import {Navigate, Route, Routes} from "react-router-dom";
import {Error404} from "./components/ui/error-404";
import Layout from "./components/layouts/global/layout";
import Home from "./pages/dashboard/home";
import LoginPage from "./pages/auth/login";
import SetupWorkspace from './pages/auth/setup-workspace';
import SpaceHome from './pages/space/space-home';

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/home" />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route path={"/setup"} element={<SetupWorkspace />} />
        <Route element={<Layout />}>
          <Route path={"/home"} element={<Home />} />
          <Route path={"/s/:spaceSlug"} element={<SpaceHome />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  )
}

export default App
