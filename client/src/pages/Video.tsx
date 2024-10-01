import { useEffect, useRef, useState } from "react";
import {
  Form,
  Navigate,
  useLoaderData,
  useSearchParams,
} from "react-router-dom";
import TagModal from "../components/TagModal";
import TagChip from "../components/TagChip";
import PersonChip from "../components/PersonChip";
import PersonModal from "../components/PersonModal";
import useAuth from "../hooks/useAuth";
import PlaylistAddDialog from "../components/PlaylistAddDialog";

type Person = {
  id: number;
  name: string;
};

type Tag = {
  id: number;
  name: string;
};

type VideoData = {
  id: number;
  filename: string;
  filepath: string;
  videoCodec: string;
  height: number;
  width: number;
  audioCodec: string;
  duration: number;
  size: number;
  views: number;
  rating: { rating: number; userRating: number };
  people: Person[];
  tags: Tag[];
  updatedAt: string;
  createdAt: string;
};

type LoaderData = {
  video: VideoData;
};

function Video() {
  const auth = useAuth();
  if (!auth.isLoggedIn) return <Navigate to="/" />;

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    video: {
      filename,
      filepath,
      size,
      views,
      height,
      width,
      videoCodec,
      audioCodec,
      id,
      duration,
      tags,
      people,
      rating,
    },
  } = useLoaderData() as LoaderData;

  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    ref.current!.volume = parseFloat(localStorage.getItem("volume") || "1");
  }, []);

  const [start, setStart] = useState<number>(0);
  const [seeked, setSeeked] = useState<boolean>(false);
  const [isViewed, setIsViewed] = useState<boolean>(false);

  function formatSize(s: number) {
    const kb = s / 1024;
    if (kb < 1000) return `${kb.toFixed(2)}kb`;
    const mb = s / 1024 / 1024;
    if (mb < 1000) return `${mb.toFixed(2)}mb`;
    const gb = s / 1024 / 1024 / 1024;
    if (gb < 1000) return `${gb.toFixed(2)}gb`;
    return "That sucker is huge!";
  }

  function formatDuration(d: number) {
    const s = (d % 60).toString().padStart(2, "0");
    const m = Math.floor((d / 60) % 60)
      .toString()
      .padStart(2, "0");
    const h = Math.floor(d / 3600)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  async function handleProgress(e: any) {
    if (isViewed) return;
    const {
      target: { currentTime },
    } = e;
    try {
      if (!seeked && currentTime - start > 30) {
        setIsViewed(true);
        await fetch(`${import.meta.env.VITE_API_URL}/video/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ update: "views", id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("showcase"),
          },
        });
      }

      if (seeked) setSeeked(false);
    } catch (error) {}
  }

  function handleSeeking(e: any) {
    if (isViewed) return;
    setSeeked(true);
    setStart(e.target.currentTime);
  }

  function handleVolumeChange(e: any) {
    localStorage.setItem("volume", e.target.volume.toString());
  }

  function handleOpenPlaylistModal() {
    searchParams.set("modal", "playlist");
    setSearchParams(searchParams);
  }

  return (
    <div className="video-container">
      <div>
        <p className="video-title">
          {filename.slice(filename.lastIndexOf("/") + 1)}
        </p>
        <div className="video-details">
          <span>Size: {formatSize(size)}</span>
          <span>Views: {views}</span>
          <span>Duration: {formatDuration(duration)} </span>
          <span>
            Dimensions: {width}x{height}
          </span>
          <span>Video Codec: {videoCodec}</span>
          <span>Audio Codec: {audioCodec}</span>
        </div>
        <div className="flex">
          <button className="btn" onClick={handleOpenPlaylistModal}>
            +Playlist
          </button>
          <div className="rating-selector">
            Rating:{" "}
            {[...Array(rating.rating)].map((_, i) => (
              <Form key={i} method="post">
                <input type="hidden" name="videoId" value={id} />
                <input type="hidden" name="rating" value={i + 1} />
                <button
                  key={i}
                  className="rating-star-btn-on"
                  type="submit"
                  name="intent"
                  value="rating"
                >
                  &#9733;
                </button>
              </Form>
            ))}
            {[...Array(5 - rating.rating)].map((_, i) => (
              <Form key={i} method="post">
                <input type="hidden" name="videoId" value={id} />
                <input
                  type="hidden"
                  name="rating"
                  value={rating.rating + i + 1}
                />
                <button
                  key={i}
                  className="rating-star-btn-off"
                  type="submit"
                  name="intent"
                  value="rating"
                >
                  &#9733;
                </button>
              </Form>
            ))}
            <span className="half-text">({rating.userRating})</span>
          </div>
        </div>
        <div className="chip-container">
          <span>Tags: </span>
          {tags.map((data) => (
            <TagChip key={data.id} {...data} videoId={id} />
          ))}
          <TagModal />
        </div>
        <div className="chip-container">
          <span>People: </span>
          {people.length > 0 &&
            people.map((data) => (
              <PersonChip key={data.id} {...data} videoId={id} />
            ))}
          <PersonModal />
        </div>

        {auth.user?.admin && (
          <Form className="flexer3" method="POST">
            <input type="hidden" name="videoId" value={id} />
            <button className="btn" type="submit" name="intent" value="delete">
              Delete
            </button>
            <button className="btn" type="submit" name="intent" value="regen">
              Regen Thumbs
            </button>
            <button className="btn" type="submit" name="intent" value="convert">
              Convert Video
            </button>
          </Form>
        )}
      </div>
      <div className="grow" />
      <div className="video-player-container">
        <video
          ref={ref}
          controls
          onSeeking={handleSeeking}
          onProgress={handleProgress}
          onVolumeChange={handleVolumeChange}
        >
          <source
            src={`${import.meta.env.VITE_API_URL}/${encodeURIComponent(
              `${filepath}/${filename}`
            )}`}
          ></source>
        </video>
      </div>
      {searchParams.has("modal", "playlist") && (
        <PlaylistAddDialog videoId={id} />
      )}{" "}
    
    </div>
  );
}

export default Video;
