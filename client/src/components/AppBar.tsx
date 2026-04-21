import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React, { useEffect, useState } from "react";
import useLimitSize from "../hooks/useLimitSize";

export default function AppBar() {
  const { isLoggedIn } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [underlined, setUnderlined] = useState<string>("");
  const limit = useLimitSize();

  useEffect(() => {
    const name = "advanced-search";
    searchParams.has(name, "open") || sessionStorage.getItem(name) === "open"
      ? setUnderlined("txt-underlined")
      : setUnderlined("");
  }, [searchParams]);

  function handleClick() {
    const name = "advanced-search";
    if (searchParams.has(name, "open")) {
      sessionStorage.removeItem(name);
      searchParams.delete(name);
    } else {
      sessionStorage.setItem(name, "open");
      searchParams.set(name, "open");
    }
    setSearchParams(searchParams);
  }

  return (
    <div className="appbar-container">
      <div className="appbar-inner-container">
        <Link
          reloadDocument
          to={`/videos?page=${sessionStorage.getItem("page")?.toString() || "1"}&limit=${limit}${sessionStorage.getItem("search") ? `&search=${sessionStorage.getItem("search")}` : ""}`}
        >
          <p className="title">Showcase</p>
        </Link>
        <div className="grow" />
        <nav>
          {isLoggedIn ? (
            <>
              <div>
                <SearchBar />
                <span className={`txt-sm ${underlined}`} onClick={handleClick}>
                  Advanced Search
                </span>
              </div>
              <UserMenu />

            </>
          ) : (
            <>
              <Link to={"/login"}>
                <p>Login</p>
              </Link>
              <Link to={"/signup"}>
                <p>Signup</p>
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState<string>(searchParams.get("search") || "");

  function handleSubmit(e: any) {
    e.preventDefault();
    if (input.length > 0) {
      searchParams.set("search", input.trim());
      sessionStorage.setItem("search", input.trim());
    } else {
      searchParams.delete("search");
      sessionStorage.removeItem("search");
    }
    searchParams.set("page", "1");
    sessionStorage.setItem("page", "1");
    navigate(`/videos?${searchParams.toString()}`);
  }

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSubmit}>
        <div>
          <button className="searchbar-btn" type="submit">
            <span>?</span>
          </button>
          <input
            className="searchbar"
            type="search"
            name="search"
            placeholder="Search"
            value={input}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              setInput(e.currentTarget.value)
            }
          />
        </div>
      </form>
    </div>
  );
}


function UserMenu() {

  const { clearToken, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log("toggling menu");
    setIsOpen(!isOpen);
  }

  const logout = () => {
    clearToken();
    toggleMenu();
  }


  return <div><div className="menu-container">

    <div className="menu-title">
      <input className="dropdown menu-checkbox" type="checkbox" id="dropdown" name="dropdown" onClick={toggleMenu} checked={isOpen} />
      <label className="for-dropdown" htmlFor="dropdown">User</label>
    </div>

  </div>
    {isOpen && <div className="menu-dropdown-container">
      <span>{user.name}</span>
      <Link to={"/playlists"} onClick={toggleMenu}>
        <p>Playlists</p>
      </Link>
      <Link to={"/history"} onClick={toggleMenu}>
        <p>History</p>
      </Link>
      <Link to={"/admin"} onClick={toggleMenu}>
        <p>Admin</p>
      </Link>
      <Link to="/" onClick={logout}>
        <p>Logout</p>
      </Link>
    </div>}
  </div>


}