import useAuth from "../hooks/useAuth";
import VideoWall from "../components/VideoWall";

export default function Home() {
  const isAuthed = useAuth();
  if (isAuthed) return <VideoWall />;
  else return <div>Sign up now!</div>;
}
