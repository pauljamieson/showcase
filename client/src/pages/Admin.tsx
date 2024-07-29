import { Link } from "react-router-dom";

export default function () {
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
