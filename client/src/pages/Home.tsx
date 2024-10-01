import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export function homeLoader() {
  return "hello world";
}

export default function Home() {
  const isAuthed = useAuth();

  if (isAuthed.auth)
    return (
      <Navigate
        to={`videos?page=${sessionStorage.getItem("page") || 1}&limit=8`}
      />
    );
  else return <div>Sign up now!</div>;
}
