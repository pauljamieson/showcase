import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AppBar() {
  const { auth } = useAuth();
  
  function clickSignOut() {
    localStorage.removeItem("showcase");
  }

  return (
    <div className="appbar-container">
      <Link to={"/"}>
        <p className="title">Showcase</p>
      </Link>
      <div className="grow" />
      <nav>
        <ol>
          {auth ? (
            <>
              <li>
                <Link to={"/"} reloadDocument onClick={clickSignOut}>
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
