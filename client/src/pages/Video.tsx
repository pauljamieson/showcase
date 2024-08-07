import { useState } from "react";
import {
  Form,
  useFormAction,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import videoAction from "../actions/video";

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
    },
  } = useLoaderData() as LoaderData;

  const actionData: ActionData = useFormAction() as ActionData;

  const navigate = useNavigate();
  if (actionData.status === "success") return navigate(-1);

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

  return (
    <div className="video-container">
      <div className="video-player-container">
        <video controls onSeeking={handleSeeking} onProgress={handleProgress}>
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
      <div>
        <h1>{filename.slice(filename.lastIndexOf("/") + 1)}</h1>
        {encodeURI(
          `http://localhost:5000/${filename
            .split("/")
            .filter((_, idx) => idx > 2)
            .join("/")}`
        )}
        <p>
          Size: {formatSize(size)} <br />
          Views: {views} <br />
          Duration: {formatDuration(duration)} <br />
          Dimensions: {width}x{height} <br />
          Video Codec: {videoCodec} <br />
          Audio Codec: {audioCodec}
        </p>
        <Form method="POST">
          <input type="hidden" name="videoId" value={id} />
          <button type="submit" name="intent" value="delete">
            Delete
          </button>
          <button type="submit" name="intent" value="regen">
            Regen Thumbs
          </button>
        </Form>
      </div>
    </div>
  );
}

export default Video;
