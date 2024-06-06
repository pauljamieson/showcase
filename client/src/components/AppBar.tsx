import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

export default function AppBar() {
  const isAuthed = useAuth(); //  useContext(AuthContext);
  console.log(isAuthed);
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
          {isAuthed ? (
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
