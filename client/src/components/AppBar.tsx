import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AppBar() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="appbar-container">
      <Link to={"/"}>
        <p className="title">Showcase</p>
      </Link>
      <div className="grow" />
      <nav>
        <ol>
          {isLoggedIn ? (
            <>
              {user?.admin && (
                <li>
                  <Link to={"/admin"}>
                    <p>Admin</p>
                  </Link>
                </li>
              )}

              <li>
                <Link to={"/profile"}>
                  <p>{user?.name}</p>
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
