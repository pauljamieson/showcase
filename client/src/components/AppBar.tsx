import { Link } from "react-router-dom";

export default function AppBar() {
  const isAuthed: string | null = localStorage.getItem("showcase");
  return (
    <div className="appbar-container">
      <Link to={"/"}>
        <p className="title">Showcase</p>
      </Link>
      <div className="grow" />
      <nav>
        <ol>
          {isAuthed ? (
            <>
              <li>
                <Link to={"/"}>
                  <p>Sign Out</p>
                </Link>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ol>
      </nav>
    </div>
  );
}
