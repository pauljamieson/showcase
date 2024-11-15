import {
  Navigate,
  useLoaderData,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import VideoCard from "../components/VideoCard";
import Paginator from "../components/Paginator";
import useAuth from "../hooks/useAuth";
import useLimitSize from "../hooks/useLimitSize";
import { useEffect, useState } from "react";
import PersonSearch from "../components/PersonSearch";
import TagSearch from "../components/TagSearch";
import SortOrder from "../components/SortOrder";
import apiRequest, { RequestConfig } from "../lib/api";

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
  const auth = useAuth();
  const size = useLimitSize();
  const [lastSize, setLastSize] = useState<number>(size);

  const [searchParams, setSearchParams] = useSearchParams();
  if (!auth.isLoggedIn) return <Navigate to="/login" />;

  useEffect(() => {
    const curLimit = searchParams.get("limit") || 10;
    const page = searchParams.get("page") || 1;
    const lastTotal = lastSize * +page;
    const newPage =
      Math.floor(lastTotal / size) >= 1 ? Math.floor(lastTotal / size) : 1;
    if (+curLimit !== size) {
      searchParams.set("limit", size.toString());
      searchParams.set("page", newPage.toString());
      setSearchParams(searchParams);
    }
    setLastSize(size);
  }, [size]);

  const data: LoaderData = useLoaderData() as LoaderData;
  return (
    <>
      <div className="videos-container">
        <AdvanceSearch />
        <Paginator count={data.count} />
        <div className="video-card-container">
          {data &&
            data.files.map((val) => <VideoCard key={val.id} videoFile={val} />)}
        </div>
      </div>
    </>
  );
}

function AdvanceSearch() {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  const [opened, setOpened] = useState<string>("");

  const orders: any[] = [
    { name: "order", options: ["Oldest", "Newest"], alwaysOn: true },
    { name: "views", options: ["Least Views", "Most Views"] },
    { name: "duration", options: ["Shortest", "Longest"] },
    { name: "size", options: ["Small", "Big"] },
    { name: "alpha", options: ["A-Z", "Z-A"] },
  ];

  useEffect(() => {
    const name = "advanced-search";
    searchParams.has(name, "open") ? setOpened("opened") : setOpened("");
  }, [searchParams]);

  function handleClick() {
    const terms = searchParams.get("search") || "";
    const people = searchParams.getAll("people");
    const tags = searchParams.getAll("tags");
    const body = { terms, people, tags };

    const data: RequestConfig = {
      method: "post",
      endpoint: "/videos",
      body,
    };
    apiRequest(data).then(({ status, data, error }) => {
      if (error) return console.error(error);
      if (status === "success") {
        const state = { search: "?" + searchParams.toString() };
        navigate(`/video/${data.id}`, { state });
      }
    });
  }

  return (
    <div className={`advanced-search-container callapsible ${opened}`}>
      <div className="search-bar">
        <PersonSearch /> <TagSearch />{" "}
        <button className="btn" onClick={handleClick}>
          I'm Feeling Lucky
        </button>
      </div>
      <div className="toggle-bar">
        <SortOrder {...orders[0]} />
        <SortOrder {...orders[1]} />
        <SortOrder {...orders[2]} />
        <SortOrder {...orders[3]} />
        <SortOrder {...orders[4]} />
      </div>
    </div>
  );
}
