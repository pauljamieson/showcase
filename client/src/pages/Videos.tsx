import { useLoaderData } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import Paginator from "../components/Paginator";

type LoaderData = {
  files: VideoFile[];
  count: number;
};

export type VideoFile = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  filename: string;
  size: number;
  duration: number;
  height: number;
  width: number;
  videoCodec: string;
  audioCodec: string;
  views: number;
  rating: number;
  tags: Tag[];
  people: Person[];
};

export type Tag = {
  id: number;
  name: string;
};

export type Person = {
  id: number;
  name: string;
};

export default function Videos() {
  const data: LoaderData = useLoaderData() as LoaderData;
  return (
    <>
      <Paginator count={data.count} />
      <div className="video-card-container">
        {data && data.files.map((val) => <VideoCard videoFile={val} />)}
      </div>
    </>
  );
}
