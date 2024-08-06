import { VideoFile } from "../pages/Videos";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/*
    id: 313,
    createdAt: 2024-08-05T00:00:06.699Z,
    updatedAt: 2024-08-05T00:00:08.709Z,
    filename: './app_data/videos/0/313/[SybilRaw] Sybil Pimp Of The Year - Kazumi [1080p].mp4',
    size: 1411752442,
    duration: 1824,
    height: 1080,
    width: 1920,
    videoCodec: 'h264',
    audioCodec: 'aac',
    views: 0,
    rating: 0,
    tags: [],
    people: []
*/
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
          src={`${filePath}/thumbs/${filename}-${imgNum}.jpg`}
        />
      </Link>
      {filename}
    </div>
  );
}
