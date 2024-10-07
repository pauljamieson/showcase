import { useLoaderData } from "react-router-dom";
import { formatDuration } from "../lib/formats";
import { Link } from "react-router-dom";

interface Playlist {
  id: number;
  name: String;
  userId: number;
  playlistItems: PlaylistItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface PlaylistItem {
  id: number;
  position: number;
  videoId: number;
  playlistId: number;
  createdAt: Date;
  updatedAt: Date;
  video: Video;
}

interface Video {
  id: number;
  duration: number;
  filename: string;
  filepath: string;
  views: number;
}

interface LoaderData {
  status: string;
  data: { playlist: Playlist };
  error: string;
}

export default function Playlist() {
  const {
    data: { playlist },
  } = useLoaderData() as LoaderData;

  return (
    <div className="playlist-container">
      <PlaylistTitleCard playlist={playlist} />
      <div className="playlist-items-container">
        {playlist.playlistItems
          .sort((a, b) => a.position - b.position)
          .map((v) => (
            <PlaylistEntry key={v.videoId} playlistItem={v} />
          ))}
      </div>
    </div>
  );
}

function PlaylistTitleCard({ playlist }: { playlist: Playlist }) {
  const videoFile = playlist.playlistItems[0]?.video;
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1
  );
  return (
    <div className="playlist-titlecard-container">
      <div className="playlist-titlecard-img ">
        <img
          id="playlist-thumb"
          alt="image"
          src={`${filePath}/thumbs/${encodeURIComponent(
            filename.slice(0, filename.lastIndexOf("."))
          )}-3.jpg`}
        />
      </div>
      <div className="playlist-info-container">
        <span className="txt-lg">Name: {playlist?.name}</span>
        <div className="flex-col">
          <span className="txt-sm">
            {playlist.playlistItems.length} Videos (``
            {formatDuration(
              playlist.playlistItems.reduce((a, v) => a + v.video.duration, 0)
            )}
            )
          </span>
          <span className="txt-sm">
            Updated: {new Date(playlist?.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function PlaylistEntry({ playlistItem }: { playlistItem: PlaylistItem }) {
  const videoFile = playlistItem.video;
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1
  );
  return (
    <Link to={`/video/${playlistItem.videoId}`}>
      <div className="playlist-entry-container">
        <div>
          <div className="burger-handle">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="flex">
          <div className="playlist-entrycard-img ">
            <img
              id="playlist-thumb"
              alt="image"
              src={`${filePath}/thumbs/${encodeURIComponent(
                filename.slice(0, filename.lastIndexOf("."))
              )}-3.jpg`}
            />
          </div>
          <div className="playlist-entry-info">
            <span>{playlistItem.video.filename}</span>
            <span className="txt-sm">{playlistItem.video.views} views</span>
            <span className="txt-sm">
              {formatDuration(playlistItem.video.duration)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
