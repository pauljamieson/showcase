import { useEffect, useRef, useState } from "react";
import { Form, Navigate, useActionData, useLoaderData } from "react-router-dom";
import TagModal from "../components/TagModal";
import TagChip from "../components/TagChip";
import PersonChip from "../components/PersonChip";
import PersonModal from "../components/PersonModal";
import useAuth from "../hooks/useAuth";

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
  videoCodec: string;
  height: number;
  width: number;
  audioCodec: string;
  duration: number;
  size: number;
  views: number;
  rating: number;
  people: Person[];
  tags: Tag[];
  updatedAt: string;
  createdAt: string;
};

type LoaderData = {
  video: VideoData;
};

type ActionData = {
  status: string;
};

function Video() {
  const auth = useAuth();
  if (!auth.isLoggedIn) return <Navigate to="/login" />;

  const {
    video: {
      filename,
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
    },
  } = useLoaderData() as LoaderData;

  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    ref.current!.volume = parseFloat(localStorage.getItem("volume") || "1");
  }, []);

  const actionData = useActionData() as ActionData;
  if (actionData?.status === "success") return <Navigate to="/" />;

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
        await fetch(`http://localhost:5000/video/${id}`, {
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

  return (
    <div className="video-container">
      <div>
        <h1 className="video-title">
          {filename.slice(filename.lastIndexOf("/") + 1)}
        </h1>
        <div className="video-details">
          <span> Size: {formatSize(size)}</span>
          <span>Views: {views}</span>
          <span>Duration: {formatDuration(duration)} </span>
          <span>
            Dimensions: {width}x{height}
          </span>
          <span>Video Codec: {videoCodec}</span>
          <span>Audio Codec: {audioCodec}</span>
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
            src={`http://localhost:5000/${encodeURIComponent(
              filename
                .split("/")
                .filter((_, idx) => idx > 2)
                .join("/")
            )}`}
          ></source>
        </video>
      </div>
    </div>
  );
}

export default Video;
