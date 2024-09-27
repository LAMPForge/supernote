import {Navigate, Route, Routes} from "react-router-dom";
import {Error404} from "./components/ui/error-404.tsx";
import Layout from "./components/layouts/global/layout.tsx";
import Home from "./pages/dashboard/home.tsx";
import LoginPage from "./pages/auth/login.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/home" />} />
        <Route path={"/login"} element={<LoginPage />} />
        <Route element={<Layout />}>
          <Route path={"/home"} element={<Home />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  )
}

export default App
