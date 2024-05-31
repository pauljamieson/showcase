import { Link } from "react-router-dom";

export default function AppBar() {
  return (
    <div className="appbar-container">
      <Link to={"/"}>
        <h1>Showcase</h1>
      </Link>
      <div className="grow" />
      <nav>
        <ol>
          <li>
            <Link to={"/signup"}>
              <h3>Signup</h3>
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
}
