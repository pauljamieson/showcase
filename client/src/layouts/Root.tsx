import AppBar from "../components/AppBar";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <AppBar />
      <div className="home-outlet">
        <Outlet />
      </div>
    </div>
  );
}
