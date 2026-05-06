import {
  useLoaderData,
  useSearchParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { formatDuration } from "../lib/formats";
import apiRequest from "../lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import React, { useEffect, useState } from "react";

library.add(fas, far, fab);

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
  const [activePlaylist, setActivePlaylist] = useState(null as Playlist | null);

  const {
    data: { playlist },
  } = useLoaderData() as LoaderData;

  useEffect(() => {
    setActivePlaylist((prev) => {
      if (playlist == prev) return prev;
      else return playlist;
    });
  }, [playlist]);

  return (
    <div className="playlist-container">
      {activePlaylist && <PlaylistTitleCard playlist={activePlaylist} />}
      <div
        className="playlist-items-container"
        draggable={false}
        onDragStart={() => {
          return false;
        }}
      >
        {activePlaylist?.playlistItems
          .sort((a, b) => a.position - b.position)
          .map((v) => (
            <PlaylistEntry
              key={v.videoId}
              playlist={activePlaylist}
              position={v.position - 1}
              setPlaylist={setActivePlaylist}
            />
          ))}
      </div>
    </div>
  );
}

function PlaylistTitleCard({ playlist }: { playlist: Playlist }) {
  const videoFile = playlist.playlistItems[0]?.video;
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000,
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1,
  );
  return (
    <Link
      to={`/video/${playlist.playlistItems[0].videoId}?playlist=${playlist.id}`}
    >
      <div className="playlist-titlecard-container">
        <div className="playlist-titlecard-img ">
          <img
            id="playlist-thumb"
            alt="image"
            src={`${filePath}/thumbs/${encodeURIComponent(
              filename.slice(0, filename.lastIndexOf(".")),
            )}-3.jpg`}
          />
        </div>
        <div className="playlist-info-container">
          <span className="txt-lg">Name: {playlist?.name}</span>
          <div className="flex-col">
            <span className="txt-sm">
              {playlist.playlistItems.length} Videos (
              {formatDuration(
                playlist.playlistItems.reduce(
                  (a, v) => a + v.video.duration,
                  0,
                ),
              )}
              )
            </span>
            <span className="txt-sm">
              Updated: {new Date(playlist?.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface PlaylistEntryInterface {
  playlist: Playlist;
  position: number;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
}

function PlaylistEntry({
  playlist,
  position,
  setPlaylist,
}: PlaylistEntryInterface) {
  const [searchParams, setSearchParams] = useSearchParams();
  const playlistItem = playlist.playlistItems[position];
  const videoFile = playlist.playlistItems[position].video;
  const [hideOptions, setHideOptions] = useState(true);

  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000,
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1,
  );

  function handleDragStartInvalid() {
    return false;
  }

  function handleDragStart(e: any) {
    e.stopPropagation();
    e.target.style.opacity = ".3";
    e.dataTransfer.setData("draggedId", e.target.id);
  }

  function handleDragEnd(e: any) {
    e.stopPropagation();
    e.target.style.opacity = "1";
  }

  async function handleDrop(e: any) {
    e.stopPropagation();

    // get dragged entry and the container it came from
    const draggedId = e.dataTransfer.getData("draggedId");
    const dragged = document.getElementById(draggedId);
    const fromCont = dragged?.parentElement;

    // get the entry dropped onto and container it came from
    const dropped = document.getElementById(e.currentTarget.id);
    const toCont = dropped?.parentElement;

    const fromPosition = +dragged?.dataset.position!;
    const toPosition = +toCont?.id!;

    const body = { fromPosition, toPosition, playlistId: playlist.id };

    if (fromPosition && toPosition && fromCont !== toCont) {
      await apiRequest({
        endpoint: `/playlist/${playlist.id}`,
        method: "put",
        body,
      });
      setSearchParams(searchParams);
    }
  }

  function handleDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  function toggleOptions(mode: "show" | "hide" | "toggle") {
    if (mode === "show") {
      setHideOptions(false);
    } else if (mode === "hide") {
      setHideOptions(true);
    } else if (mode === "toggle") {
      setHideOptions(!hideOptions);
    }
  }

  return (
    <div
      id={playlistItem.position.toString()}
      className="playlist-entry-wrapper"
    >
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
          </div>
        </div>
        <Link
          to={`/video/${videoFile.id}?playlist=${playlist.id}&position=${playlistItem.position}`}
        >
          <div
            className="flex playlist-entry-info-container"
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
                  filename.slice(0, filename.lastIndexOf(".")),
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
        </Link>
        <div className="grow"></div>
        <div className="playlist-entry-options">
          <FontAwesomeIcon
            icon={fas.faEllipsisV}
            size="lg"
            onClick={() => toggleOptions("show")}
          />
          <MenuOptions
            isHidden={hideOptions}
            handleClose={() => toggleOptions("hide")}
            playlistItemId={playlist.playlistItems[position].id}
            playlist={playlist}
            setPlaylist={setPlaylist}
          />
        </div>
      </div>
    </div>
  );
}

function MenuOptions({
  isHidden,
  handleClose,
  playlistItemId,
  playlist,
  setPlaylist,
}: {
  isHidden: boolean;
  handleClose: () => void;
  playlistItemId: number;
  playlist: Playlist;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
}) {
  const optionRef = React.useRef<HTMLDivElement>(null);

  function handleDelete(e: any) {
    e.preventDefault();

    apiRequest({
      endpoint: `/playlist/`,
      method: "delete",
      body: { id: playlistItemId },
    }).then((resp) => {
      setPlaylist((prev) => {
        if (!prev) return prev;
        return resp.data as Playlist;
      });
      handleClose();
    });
  }

  function handleMoveToItem(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    const modifer =
      e.currentTarget.id === "option-bottom"
        ? playlist.playlistItems.length
        : 1;
    const body = {
      fromPosition:
        playlist.playlistItems.findIndex((item) => item.id === playlistItemId) +
        1,
      toPosition: modifer,
      playlistId: playlist.id,
    };

    apiRequest({
      endpoint: `/playlist/${playlist.id}`,
      method: "put",
      body,
    }).then((resp) => {
      setPlaylist((prev) => {
        if (!prev) return prev;
        return resp.data as Playlist;
      });
      handleClose();
    });
  }

  return (
    <div hidden={isHidden} className="playlist-menu-options" ref={optionRef}>
      <div onClick={handleMoveToItem} id="option-top" className="menu-item">
        Move to top
      </div>
      <div onClick={handleMoveToItem} id="option-bottom" className="menu-item">
        Move to bottom
      </div>
      <div onClick={handleDelete} className="menu-item">
        Delete
      </div>
      <div onClick={handleClose} className="menu-item">
        Close
      </div>
    </div>
  );
}
