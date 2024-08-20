import { Link, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function () {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn || !user?.admin) return <Navigate to="/" />;
  return (
    <div className="admin-container">
      <div className="admin-btn-bar">
        <Link className="btn" to={"incoming"}>
          Manage Incoming
        </Link>
        <button className="btn">Manage Tags</button>
        <button className="btn">Manage Cast</button>
        <button className="btn">Maintenance</button>
      </div>
    </div>
  );
}
