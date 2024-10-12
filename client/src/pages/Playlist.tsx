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
      <div
        className="playlist-items-container"
        draggable={false}
        onDragStart={() => {
          return false;
        }}
      >
        {playlist.playlistItems
          .sort((a, b) => a.position - b.position)
          .map((v) => (
            <PlaylistEntry
              key={v.videoId}
              playlist={playlist}
              position={v.position - 1}
            />
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

interface PlaylistEntryInterface {
  playlist: Playlist;
  position: number;
}
function PlaylistEntry({ playlist, position }: PlaylistEntryInterface) {
  const playlistItem = playlist.playlistItems[position];
  const videoFile = playlist.playlistItems[position].video;
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1
  );

  let dragged;

  function handleDragStartInvalid() {
    return false;
  }

  function handleDragStart(e: any) {
    e.stopPropagation();
    e.target.style.opacity = ".3";
    dragged = e.target;
    e.dataTransfer.setData("draggedId", e.target.id);
  }

  function handleDragEnd(e: any) {
    e.stopPropagation();
    e.target.style.opacity = "1";
  }

  function handleDrop(e: any) {
    e.stopPropagation();

    // get dragged entry and the container it came from
    const draggedId = e.dataTransfer.getData("draggedId");
    const dragged = document.getElementById(draggedId);
    const fromCont = dragged?.parentElement;

    // get the entry dropped onto and container it came from
    const dropped = document.getElementById(e.currentTarget.id);
    const toCont = dropped?.parentElement;

    if (fromCont !== toCont) {
      const draggedPosition = +(dragged?.dataset.position || 0);
      const droppedPosition = +(dropped?.dataset.position || 0);

      playlist.playlistItems[+draggedPosition].position = +droppedPosition;
      playlist.playlistItems[droppedPosition].position = draggedPosition;
      toCont?.appendChild(dragged!);
      fromCont?.appendChild(dropped!);
    }
  }

  function handleDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  return (
    <div id={playlistItem.position.toString()}>
      <div
        draggable="true"
        id={`item-${playlistItem.id.toString()}`}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="playlist-entry-container"
        data-position={playlistItem.position}
      >
        <div draggable={false} onDragStart={handleDragStartInvalid}>
          <div
            className="burger-handle"
            draggable={false}
            onDragStart={handleDragStartInvalid}
          >
            <span draggable={false} onDragStart={handleDragStartInvalid}></span>
            <span draggable={false} onDragStart={handleDragStartInvalid}></span>
            <span draggable={false} onDragStart={handleDragStartInvalid}></span>
          </div>
        </div>
        <div
          className="flex"
          draggable={false}
          onDragStart={handleDragStartInvalid}
        >
          <div
            className="playlist-entrycard-img "
            draggable={false}
            onDragStart={handleDragStartInvalid}
          >
            <img
              id="playlist-thumb"
              alt="image"
              src={`${filePath}/thumbs/${encodeURIComponent(
                filename.slice(0, filename.lastIndexOf("."))
              )}-3.jpg`}
              draggable={false}
              onDragStart={handleDragStartInvalid}
            />
          </div>
          <div
            className="playlist-entry-info"
            draggable={false}
            onDragStart={handleDragStartInvalid}
          >
            <span draggable={false} onDragStart={handleDragStartInvalid}>
              {playlistItem.video.filename}
            </span>
            <span
              className="txt-sm"
              draggable={false}
              onDragStart={handleDragStartInvalid}
            >
              {playlistItem.video.views} views
            </span>
            <span
              className="txt-sm"
              draggable={false}
              onDragStart={handleDragStartInvalid}
            >
              {formatDuration(playlistItem.video.duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
