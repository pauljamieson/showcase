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
        <Link className="btn" to={"tags"}>
          Manage Tags
        </Link>{" "}
        <Link className="btn" to={"people"}>
          Manage People
        </Link>
      </div>
    </div>
  );
}
