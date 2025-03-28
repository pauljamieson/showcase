import { useLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";

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
  _count: { playlistItems: number };
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
      <div className="flex p5 flex-cen ">
        <span className="txt-lg">Playlists</span>
      </div>
      <div className="playlist-card-container">
        {data.playlists.map((v) => (
          <PlaylistCard key={v.id} {...v} />
        ))}
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}

function PlaylistCard({ ...playlist }: Playlist) {
  const videoFile = playlist.playlistItems[0]?.video;
  if (!videoFile) return <div>Nope</div>;
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1
  );
  return (
    <div className="playlist-card cursor-def">
      <div className="relative">
        <Link
          to={`/video/${playlist.playlistItems[0].videoId}?playlist=${playlist.id}&position=1`}
        >
          <div className="playlist-card-img-container">
            <img
              id="playlist-thumb"
              alt="image"
              src={`${filePath}/thumbs/${encodeURIComponent(
                filename.slice(0, filename.lastIndexOf("."))
              )}-3.jpg`}
            />

            <div className="absolute bot-10 r-10 bg1 border1 p2 cursor-pass">
              <span className="txt-sm">
                Length: {playlist._count.playlistItems}
              </span>
            </div>
            <div id="playall-text" className="absolute playlist-playall-text">
              <span>Play All</span>
            </div>
          </div>
        </Link>
      </div>
      <div>
        <div>
          <span className="txt-md">{playlist.name}</span>
        </div>
        <div>
          <span className="txt-sm">
            Updated: {new Date(playlist.updatedAt).toLocaleString()}
          </span>
        </div>
        <div>
          <Link
            to={`/playlist/${playlist.id}?playlist=${btoa(
              playlist.playlistItems.toString()
            )}`}
          >
            <span className="txt-sm txt-hover">View Full List</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
