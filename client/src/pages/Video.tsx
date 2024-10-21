import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Navigate,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
  Link,
  useFetcher,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PlaylistAddDialog from "../components/PlaylistAddDialog";
import { useFileSize } from "../hooks/useFileSize";
import type { Video, VideoData } from "../types/custom";
import useVideoDuration from "../hooks/useVideoDuration";
import TagModal from "../components/TagModal";
import PersonModal from "../components/PersonModal";
import useVideoQueue from "../hooks/useVideoQueue";
import apiRequest from "../lib/api";
1
interface LoaderData {
  video: VideoData;
}

function Video() {
  //auth
  const auth = useAuth();
  if (!auth.isLoggedIn) return <Navigate to="/" />;

  // go back to videos page prep
  const navigate = useNavigate();
  const { state } = useLocation();

  // Get search params
  const [searchParams, setSearchParams] = useSearchParams();
  const playlistId = searchParams.get("playlist");

  // react router fetching hooks
  const { video } = useLoaderData() as LoaderData;
  const actionData = useActionData() as { status: string; intent: string };
  if (actionData?.intent === "delete" && actionData?.status === "success")
    navigate("/" + state?.search);

  // Get sidebar\below queue items
  const queue = useVideoQueue(playlistId ? +playlistId : undefined);

  // get reference to video element
  const ref = useRef<HTMLVideoElement | null>(null);

  // Load volume from localstorage
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
        apiRequest({
          endpoint: `${import.meta.env.VITE_API_URL}/video/${video.id}`,
          method: "patch",
          body: { update: "views", id: video.id },
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
              `${video.filepath}/${video.filename}`
            )}`}
          ></source>
        </video>

        <VideoInfo video={video} />

        <AdminBar id={video.id.toString()} />
        <button className="btn" onClick={handleOpenPlaylistModal}>
          Open Playlists
        </button>
      </div>
      <div className="video-queue-items-container">
        {queue?.map((v: QueueItem) => (
          <VideoQueueCard
            key={v.id}
            video={v}
            playlistId={playlistId ? +playlistId : undefined}
          />
        ))}
      </div>
      {searchParams.has("modal", "playlist") && (
        <PlaylistAddDialog videoId={video.id} />
      )}
      {searchParams.has("modal", "tags") && <TagModal />}
      {searchParams.has("modal", "people") && <PersonModal />}
    </div>
  );
}

export default Video;

function AdminBar({ id }: { id: string }) {
  return (
    <>
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
    </>
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
  const [searchParams, setSearchParams] = useSearchParams();
  function handleClick(e: React.BaseSyntheticEvent) {
    searchParams.set("modal", e.target.name);
    setSearchParams(searchParams);
  }
  return (
    <div className="video-info-container">
      <span className="video-title txt-lg txt-bold">{video.filename}</span>
      <span className="txt-sm">
        {video.height}x{video.width} ({video.videoCodec}/{video.audioCodec})
      </span>
      <span className="txt-sm">{size}</span>
      <span className="txt-sm">
        {video.views} views{" "}
        <StarBar rating={video.rating} id={video.id.toString()} />
      </span>
      <br />
      <div className="txt-sm">
        <span>Tags: </span>
        {video.tags.map((v) => (
          <TagChip key={v.id} tag={v} videoId={video.id} />
        ))}{" "}
        <button className="btn btn-sm" name="tags" onClick={handleClick}>
          +
        </button>
      </div>
      <div className="txt-sm">
        <span>People: </span>
        {video.people.map((v) => (
          <PersonChip key={v.id} person={v} videoId={video.id} />
        ))}{" "}
        <button className="btn btn-sm" name="people" onClick={handleClick}>
          +
        </button>
      </div>
    </div>
  );
}

interface QueueItem {
  duration: number;
  filename: string;
  filepath: string;
  id: number;
  position: number;
  views: number;
}

function VideoQueueCard({
  video,
  playlistId = 0,
}: {
  video: QueueItem;
  playlistId?: number;
}) {
  const [searchParams, _] = useSearchParams();
  const [active, setActive] = useState<boolean>(false);
  useEffect(() => {
    if (searchParams.get("position") === video.position.toString())
      setActive(true);
  }, [searchParams]);

  const duration = useVideoDuration(video.duration);
  const filePath = `${import.meta.env.VITE_API_URL}/${Math.floor(
    video.id / 1000
  )}/${video.id % 1000}`;

  const link =
    playlistId > 0
      ? `/video/${video.id}?playlist=${playlistId}&position=${video.position}`
      : `/video/${video.id}?`;

  return (
    <Link to={link} reloadDocument>
      <div className={`video-queue-item-card ${active && "active-queue-item"}`}>
        <div className="video-queue-item-img-wrapper">
          <img
            id="queue-item-thumb"
            alt="image"
            src={`${filePath}/thumbs/${encodeURIComponent(
              video.filename.slice(0, video.filename.lastIndexOf("."))
            )}-3.jpg`}
          />
          <div className="video-card-duration-container">
            <span className="duration-txt txt-sm">{duration}</span>
          </div>
        </div>
        <div className="queue-item-info-container">
          <span className="txt-sm ">{video.filename}</span>
          <span className="txt-tiny">{video.views} views</span>
        </div>
      </div>
    </Link>
  );
}

interface PersonChip {
  person: { name: string; id: number };
  videoId: number;
}

function PersonChip({ person, videoId }: PersonChip) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      className="inline tag-list info-chip"
      method="POST"
      action="/video/:id/person/chip"
    >
      <input type="submit" className="span-chip" value={person.name} />
      <input type="hidden" name="personId" value={person.id.toString()} />
      <input type="hidden" name="videoId" value={videoId.toString()} />
    </fetcher.Form>
  );
}

interface TagChip {
  tag: { name: string; id: number };
  videoId: number;
}

function TagChip({ tag, videoId }: TagChip) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      className="inline person-list info-chip"
      method="POST"
      action="/video/:id/tag/chip"
    >
      <input type="submit" className="span-chip" value={tag.name} />
      <input type="hidden" name="tagId" value={tag.id.toString()} />
      <input type="hidden" name="videoId" value={videoId.toString()} />
    </fetcher.Form>
  );
}
