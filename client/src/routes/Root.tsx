import AppBar from "../components/AppBar";
import { Outlet } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

export default function Root() {
  return (
    <AuthContext.Provider value={true}>
      <div>
        <AppBar />
        <Outlet />
      </div>
    </AuthContext.Provider>
  );
}
