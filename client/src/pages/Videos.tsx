import {
  Navigate,
  useLoaderData,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import VideoCard from "../components/VideoCard";
import Paginator from "../components/Paginator";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import PersonSearch from "../components/PersonSearch";
import TagSearch from "../components/TagSearch";
import SortOrder from "../components/SortOrder";
import apiRequest, { RequestConfig } from "../lib/api";
import useLimitSize from "../hooks/useLimitSize";

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

  if (!auth.isLoggedIn) return <Navigate to="/login" />;

  const data: LoaderData = useLoaderData() as LoaderData;

  const size = useLimitSize();
  const [firstId, _] = useState<number | null>(
    data.files[0] ? data.files[0].id : null,
  );
  console.log(size, firstId);
  const [searchParams, setSearchParams] = useSearchParams();

  function getSortOrders(sp: URLSearchParams): void {
    const items = ["order", "views", "duration", "size", "alpha"];
    items.forEach((item) => {
      const value = sessionStorage.getItem(item);
      if (value) {
        sp.set(item, value.replace(/"/g, ""));
      }
    });
  }

  useEffect(() => {
    // get the tags and people from the search params and local storage.
    const activeTags = searchParams.getAll("tags") || [];
    const activePeople = searchParams.getAll("people") || [];
    const tags: string[] = JSON.parse(sessionStorage.getItem("tags") || "[]");
    tags.forEach(
      (v) => !activeTags.includes(v) && searchParams.append("tags", v),
    );
    const people: string[] = JSON.parse(
      sessionStorage.getItem("people") || "[]",
    );
    people.forEach(
      (v) => !activePeople.includes(v) && searchParams.append("people", v),
    );

    // Set the limit based on the screen width
    const width = innerWidth;
    const limit =
      width >= 1440 ? 15 : width >= 960 ? 12 : width >= 780 ? 9 : 10;
    searchParams.set("limit", limit.toString());

    // get the sort orders from the local storage and set them in the search params.
    getSortOrders(searchParams);

    // Update the search params in the URL
    setSearchParams(searchParams);
  }, []);

  return (
    <>
      <div className="videos-container">
        <AdvanceSearch />
        <Paginator count={data.count} />
        <div className="video-card-container">
          {data &&
            data.files.map((val) => {
              return <VideoCard key={val.id} videoFile={val} />;
            })}
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
    if (sessionStorage.getItem(name) === "open") {
      searchParams.set(name, "open");
    }
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
        <div>
          <button className="btn lucky-btn" onClick={handleClick}>
            I'm Feeling Lucky
          </button>
        </div>
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
