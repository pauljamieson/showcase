import { VideoFile } from "../pages/Videos";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function VideoCard({ videoFile }: { videoFile: VideoFile }) {
  const location = useLocation();
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
    const h = Math.floor(d / 3600).toString();
    return +h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
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
    <Link
      className="video-card"
      to={`/video/${videoFile.id}`}
      state={{ search: location.search }}
    >
      <div className="video-card-img-wrapper relative">
        <img
          alt="image"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={`${filePath}/thumbs/${encodeURIComponent(
            filename.slice(0, filename.lastIndexOf("."))
          )}-${imgNum}.jpg`}
        />
        <div className="video-card-duration-container">
          <span className="duration-txt txt-sm">
            {formatDuration(videoFile.duration)}
          </span>
        </div>
      </div>
      <div className="video-card-details">
        <span>{filename}</span>
        <span className="txt-sm">
          {videoFile.rating > 0 &&
            [...Array(videoFile.rating)].map((_, i) => (
              <span key={i} className="rating-star">
                &#9733;
              </span>
            ))}{" "}
          {videoFile.views} views
        </span>
      </div>
    </Link>
  );
}
