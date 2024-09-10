import { VideoFile } from "../pages/Videos";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function VideoCard({ videoFile }: { videoFile: VideoFile }) {
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    videoFile.id / 1000
  )}/${videoFile.id % 1000}`;
  const filename = videoFile.filename.slice(
    videoFile.filename.lastIndexOf("/") + 1
  );

  const [imgNum, setImgNum] = useState<number>(3);
  const [loop, setLoop] = useState<NodeJS.Timeout | number | undefined>(
    undefined
  );

  useEffect(() => {
    return () => clearInterval(loop);
  }, []);

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
  function handleMouseEnter() {
    setImgNum(1);
    if (loop) clearInterval(loop);
    const i = setInterval(
      () => setImgNum((old) => (old >= 10 ? 1 : old + 1)),
      750
    );
    setLoop(i);
  }

  function handleMouseLeave() {
    clearInterval(loop);
    setImgNum(3);
  }

  return (
    <Link className="video-card" to={`/video/${videoFile.id}`}>
      <div className="video-card-img-wrapper">
        <img
          alt="image"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={`${filePath}/thumbs/${encodeURIComponent(
            filename.slice(0, filename.lastIndexOf("."))
          )}-${imgNum}.jpg`}
        />
      </div>
      <div className="video-card-details">
        <p>{filename}</p>
        <div className="flex">
          <span>Length: {formatDuration(videoFile.duration)}</span>
          <span className="grow" />
          <span>Views: {videoFile.views}</span>
        </div>
        <div>
          Rating:{" "}
          {videoFile.rating > 0 ? (
            [...Array(videoFile.rating)].map((_, i) => (
              <span key={i} className="rating-star">
                &#9733;
              </span>
            ))
          ) : (
            <span>unrated</span>
          )}
        </div>
        <div className="chip-container">
          Tags:
          {videoFile.tags?.map((v) => (
            <span className="chip chip-sm" key={v.id}>
              {v.name}
            </span>
          ))}
        </div>
        <div className="chip-container">
          People:
          {videoFile.people?.map((v) => (
            <span className="chip chip-sm" key={v.id}>
              {v.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
