import { useEffect, useState } from "react";
import apiRequest from "../lib/api";
import { useSearchParams } from "react-router-dom";

export interface VideoQueue {
  items: VideoQueueItem[];
}

interface VideoQueueItem {
  videoId: number;
  position: number;
}

export default function useVideoQueue(playlistId?: number) {
  const [queue, setQueue] = useState([]);
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    apiRequest({ endpoint: `/video/queue`, method: "get", searchParams }).then(
      ({ status, data, error }) => {
        if (error) console.error(error);
        if (status === "success") {
          setQueue(data.queue);
        }
      }
    );
  }, [playlistId]);

  return queue;
}
