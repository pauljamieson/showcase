import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export function homeLoader() {
  return "hello world";
}

export default function Home() {
  const isAuthed = useAuth();

  if (isAuthed.auth) return <Navigate to="videos?page=1" />;
  else return <div>Sign up now!</div>;
}
