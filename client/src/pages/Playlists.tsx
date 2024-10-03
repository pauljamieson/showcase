import { useLoaderData } from "react-router-dom";
import Playlist from "../components/Playlist";

interface Video {
  id: number;
  filename: string;
  filepath: string;
}

interface PlaylistItem {
  id: number;
  playlistId: number;
  position: number;
  video: Video;
  videoId: number;
}

interface Playlist {
  id: number;
  name: string;
  updatedAt: Date;
  playlistItems: [PlaylistItem];
}

interface LoaderData {
  status: string;
  data: { playlists: [Playlist] };
  error: string;
}

export default function Playlists() {
  const { data, error } = useLoaderData() as LoaderData;
  return (
    <div>
      <p>Playlists</p>
      <div className="playlist-card-container">
        {data.playlists.map((v) => (
          <PlaylistCard {...v} />
        ))}
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}

function PlaylistCard({ ...playlist }: Playlist) {
  const videoFile = playlist.playlistItems[0].video;
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1
  );
  return (
    <div className="playlist-card">
      <div className="playlist-card-img-container">
        <img
          alt="image"
          src={`${filePath}/thumbs/${encodeURIComponent(
            filename.slice(0, filename.lastIndexOf("."))
          )}-3.jpg`}
        />
      </div>
    </div>
  );
}
