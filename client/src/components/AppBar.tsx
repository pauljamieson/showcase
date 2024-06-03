import { Link } from "react-router-dom";

export default function AppBar() {
  return (
    <div className="appbar-container">
      <Link to={"/"}>
        <p className="title">Showcase</p>
      </Link>
      <div className="grow" />
      <nav>
        <ol>
          <li>
            <Link to={"/login"}>
              <p>Login</p>
            </Link>
          </li>
          <li>
            <Link to={"/signup"}>
              <p>Signup</p>
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
}
