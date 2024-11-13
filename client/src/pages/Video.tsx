import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Navigate,
  useLoaderData,
  useNavigate,
  useSearchParams,
  useFetcher,
  Link,
  useLocation,
  useActionData,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";
import PlaylistAddDialog from "../components/PlaylistAddDialog";
import { useFileSize } from "../hooks/useFileSize";
import type { Video, VideoData } from "../types/custom";
import useVideoDuration from "../hooks/useVideoDuration";
import TagModal from "../components/TagModal";
import PersonModal from "../components/PersonModal";
import useVideoQueue, { VideoQueue } from "../hooks/useVideoQueue";
import apiRequest from "../lib/api";

interface vData extends VideoData {
  exists: boolean;
}

interface LoaderData {
  video: vData;
  exists: boolean;
}

function Video() {
  //auth
  const auth = useAuth();
  if (!auth.isLoggedIn) return <Navigate to="/" />;

  // Get search params
  const [searchParams, _] = useSearchParams();
  const playlistId = searchParams.get("playlist");
  const position: number = +(searchParams.get("position") || 1);

  const navigate = useNavigate();
  const { state } = useLocation();

  const actionData = useActionData() as { status: string; intent: string };

  // react router fetching hooks
  const { video } = useLoaderData() as LoaderData;

  // Get sidebar\below queue items
  const queue = useVideoQueue(playlistId ? +playlistId : undefined);

  // go back to videos page on delete
  useEffect(() => {
    if (actionData?.status === "success" && actionData?.intent === "delete") {
      // If previous page was videos page go back with last search active
      // Otherwise go back to root of videos
      const path = state?.search ? `/videos${state.search}` : `/videos`;
      navigate(path);
    }
  }, [actionData]);

  return (
    <div className="video-container" key={video.id}>
      <div className="video-player-container">
        <VideoPlayer
          video={video}
          queue={queue}
          autoPlay={state?.autoPlay ? true : false}
        />
        <VideoInfo video={video} />
        <AdminBar id={video.id.toString()} />
      </div>
      <div className="video-queue-items-container">
        {queue?.items.map((v: QueueItem) => (
          <VideoQueueCard
            key={v.id * position}
            video={v}
            playlistId={playlistId ? +playlistId : undefined}
          />
        ))}
      </div>
      <PlaylistAddDialog videoId={video.id} />
      <TagModal />
      <PersonModal />
    </div>
  );
}

export default Video;

function AdminBar({ id }: { id: string }) {
  return (
    <div className="video-info-container">
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
    </div>
  );
}

interface Rating {
  rating: number;
  userRating: number;
}

interface StarBar {
  rating: Rating;
  id: string;
}

function StarBar({ rating, id }: StarBar) {
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
  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  const [searchParams, _] = useSearchParams();
  function handleClick(e: React.BaseSyntheticEvent) {
    searchParams.set("modal", e.target.name);
    navigate(`${pathname}?${searchParams.toString()}`, {
      replace: true,
      state: { search: state?.search },
    });
  }

  return (
    <div className="video-info-container">
      <span>{state?.search}</span>
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
        {video.tags.map(({ tag }) => (
          <TagChip key={tag.id} tag={tag} videoId={video.id} />
        ))}{" "}
        <button className="btn btn-sm" name="tags" onClick={handleClick}>
          +
        </button>
      </div>
      <div className="txt-sm">
        <span>People: </span>
        {video.people.map(({ person }) => (
          <PersonChip key={person.id} person={person} videoId={video.id} />
        ))}{" "}
        <button className="btn btn-sm" name="people" onClick={handleClick}>
          +
        </button>
      </div>
      <div className="txt-sm">
        <button className="btn btn-sm" name="playlist" onClick={handleClick}>
          Playlist
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

interface VideoQueueCard {
  video: QueueItem;
  playlistId?: number;
}

function VideoQueueCard({ video, playlistId = 0 }: VideoQueueCard) {
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

interface VideoPlayer {
  video: VideoData;
  queue: VideoQueue;
  autoPlay?: boolean;
}

function VideoPlayer({ video, queue, autoPlay = false }: VideoPlayer) {
  // get reference to video element
  const ref = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [start, setStart] = useState<number>(0);
  const [seeked, setSeeked] = useState<boolean>(false);
  const [isViewed, setIsViewed] = useState<boolean>(false);

  // Load volume from localstorage
  useEffect(() => {
    ref.current!.volume = parseFloat(localStorage.getItem("volume") || "1");
  }, []);

  useEffect(() => {
    // if autoplay add slight delay
    if (autoPlay) setTimeout(() => ref.current?.play(), 750);
  }, [autoPlay]);

  async function handleProgress(e: any) {
    if (isViewed) return;
    const {
      target: { currentTime },
    } = e;
    try {
      if (!seeked && currentTime - start > 30) {
        setIsViewed(true);
        apiRequest({
          endpoint: `/video/${video.id}/`,
          method: "PATCH",
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

  function handleOnEnded() {
    if (!searchParams.has("playlist")) return;
    if (+(searchParams.get("position") || 1) !== queue.items.length) {
      const pos = +(searchParams.get("position") || 1);
      const nextVideo = queue.items[pos];
      searchParams.set("position", (pos + 1).toString());
      navigate(`/video/${nextVideo.id}?${searchParams.toString()}`, {
        state: { autoPlay: true },
      });
    }
  }

  return (
    <video
      ref={ref}
      controls
      onSeeking={handleSeeking}
      onProgress={handleProgress}
      onVolumeChange={handleVolumeChange}
      onEnded={handleOnEnded}
      preload="metadata"
      src={`${import.meta.env.VITE_API_URL}/${encodeURIComponent(
        `${video.filepath}/${video.filename}`
      )}`}
    ></video>
  );
}
