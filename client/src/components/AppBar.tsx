import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import useAuth, { User } from "../hooks/useAuth";
import React, { useState } from "react";

export default function AppBar() {
  const { isLoggedIn, user } = useAuth();
  const { state } = useLocation();
  const link = state === null ? "/" : `/videos${state?.search}`;
  return (
    <div className="appbar-container">
      <div className="appbar-inner-container">
        <Link to={link}>
          <p className="title">Showcase</p>
        </Link>
        <div className="grow" />
        <nav>
          <ol>
            {isLoggedIn ? (
              <>
                <li>
                  <SearchBar />
                </li>
                <li>
                  <UserIcon {...user} />
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
    </div>
  );
}

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [input, setInput] = useState<string>("");

  function handleSubmit(e: any) {
    e.preventDefault();
    input.length > 0
      ? searchParams.set("search", input.trim())
      : searchParams.delete("search");
    searchParams.set("page", "1");
    navigate(`/videos?${searchParams.toString()}`);
  }

  return (
    <div className="searchbar-container">
      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}

function UserIcon({ name }: User) {
  return (
    <div className="usericon-container">
      <Link to={"/profile"}>{name.at(0)}</Link>
    </div>
  );
}
