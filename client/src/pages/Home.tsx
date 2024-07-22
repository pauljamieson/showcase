import useAuth from "../hooks/useAuth";
import VideoWall from "../components/VideoWall";

export function homeLoader() {
  return "hello world";
}

export default function Home() {
  const isAuthed = useAuth();

  if (isAuthed.auth) return <VideoWall />;
  else return <div>Sign up now!</div>;
}
 