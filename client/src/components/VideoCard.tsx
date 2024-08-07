import { VideoFile } from "../pages/Videos";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function VideoCard({ videoFile }: { videoFile: VideoFile }) {
  const filePath = `http://localhost:5000/${Math.floor(videoFile.id / 1000)}/${
    videoFile.id % 1000
  }`;
  const filename = videoFile.filename
    .slice(0, videoFile.filename.lastIndexOf("."))
    .slice(videoFile.filename.lastIndexOf("/") + 1);

  const [imgNum, setImgNum] = useState<number>(3);
  const [loop, setLoop] = useState<number | undefined>(undefined);

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
    <div className="video-card">
      <Link to={`/video/${videoFile.id}`}>
        <img
          alt="image"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          src={encodeURI(`${filePath}/thumbs/${filename}-${imgNum}.jpg`)}
        />
      </Link>
      <p>
        {filename} <br />
        {formatDuration(videoFile.duration)}
      </p>
    </div>
  );
}
