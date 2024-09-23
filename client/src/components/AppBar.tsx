import { Link, Navigate, useMatch, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AppBar() {
  const { isLoggedIn, user } = useAuth();
  const isVideo = useMatch("/video/:id");
  const navigate = useNavigate();

  return (
    <div className="appbar-container">
      {isVideo ? (
        <span  onClick={() => navigate(-1)}>
          <p className="title">Showcase</p>
        </span>
      ) : (
        <Link to={"/"}>
          <p className="title">Showcase</p>
        </Link>
      )}

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
