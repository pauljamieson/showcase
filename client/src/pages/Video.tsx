import { useEffect, useRef, useState } from "react";
import {
  Form,
  Navigate,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PlaylistAddDialog from "../components/PlaylistAddDialog";
import { useFileSize } from "../hooks/useFileSize";

import type { Video, VideoData, Playlist } from "../types/custom";

import useVideoDuration from "../hooks/useVideoDuration";

interface LoaderData {
  video: VideoData;
  playlist: Playlist;
}

function Video() {
  const auth = useAuth();
  if (!auth.isLoggedIn) return <Navigate to="/" />;
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    video,
    video: { filename, filepath, id },
    playlist,
  } = useLoaderData() as LoaderData;

  const actionData = useActionData() as { status: string; intent: string };

  if (actionData?.intent === "delete" && actionData?.status === "success")
    navigate("/" + state?.search);

  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    ref.current!.volume = parseFloat(localStorage.getItem("volume") || "1");
  }, []);

  const [start, setStart] = useState<number>(0);
  const [seeked, setSeeked] = useState<boolean>(false);
  const [isViewed, setIsViewed] = useState<boolean>(false);

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

        <div>
          <VideoInfo video={video} />
        </div>
      </div>
      <div className="video-card-playlist-container">
        {playlist?.playlistItems
          .sort((a, b) => a.position - b.position)
          .map((v) => (
            <PlaylistCard video={v.video} />
          ))}
      </div>
      {searchParams.has("modal", "playlist") && (
        <PlaylistAddDialog videoId={id} />
      )}
    </div>
  );
}

export default Video;

function AdminBar({ id }: { id: string }) {
  return (
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
  );
}

interface Rating {
  rating: number;
  userRating: number;
}

function StarBar({ rating, id }: { rating: Rating; id: string }) {
  return (
    <div className="rating-selector">
      {[...Array(rating.rating)].map((_, i) => (
        <Form key={i} method="post">
          <input type="hidden" name="videoId" value={id} />
          <input type="hidden" name="rating" value={i + 1} />
          <button
            key={i}
            className="rating-star-btn-on txt-sm"
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
          <input type="hidden" name="rating" value={rating.rating + i + 1} />
          <button
            key={i}
            className="rating-star-btn-off txt-sm"
            type="submit"
            name="intent"
            value="rating"
          >
            &#9733;
          </button>
        </Form>
      ))}
      <span className="txt-sm">({rating.userRating})</span>
    </div>
  );
}

function VideoInfo({ video }: { video: VideoData }) {
  const size = useFileSize(video.size);

  return (
    <div className="video-info-container">
      <span className="video-title txt-lg txt-bold">{video.filename}</span>
      <span className="txt-sm">
        {video.height}x{video.width} ({video.videoCodec}/{video.audioCodec})
      </span>
      <span className="txt-sm">{size}</span>
      <span className="txt-sm">{video.views} views</span>
    </div>
  );
}

function PlaylistCard({ video }: { video: Video }) {
  const duration = useVideoDuration(video.duration);
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    video.id / 1000
  )}/${video.id % 1000}`;

  return (
    <div className="video-playlist-card">
      <div className="video-playlist-img-wrapper">
        <img
          id="playlist-thumb"
          alt="image"
          src={`${filePath}/thumbs/${encodeURIComponent(
            video.filename.slice(0, video.filename.lastIndexOf("."))
          )}-3.jpg`}
        />
        <div className="video-card-duration-container">
          <span className="duration-txt txt-sm">{duration}</span>
        </div>
      </div>
      <div className="video-info-container">
        <span className="txt-sm ">{video.filename}</span>
        <span className="txt-tiny">{video.views} views</span>
      </div>
    </div>
  );
}
