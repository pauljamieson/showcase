import { useEffect, useState } from "react";
import apiRequest from "../lib/api";
import { useSearchParams } from "react-router-dom";

export interface VideoQueue {
  items: VideoQueueItem[];
}

interface VideoQueueItem {
  duration: number;
  filename: string;
  filepath: string;
  id: number;
  position: number;
  views: number;
}

const initialState: VideoQueue = {
  items: [],
};

export default function useVideoQueue(playlistId?: number): VideoQueue {
  const [queue, setQueue] = useState<VideoQueue>(initialState);
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    apiRequest({ endpoint: `/video/queue`, method: "get", searchParams }).then(
      ({
        status,
        data,
        error,
      }: {
        status: string;
        data: { queue: VideoQueueItem[] };
        error: string;
      }) => {
        if (error) console.error(error);
        const newQueue: VideoQueue = { items: data.queue };
        if (status === "success") {
          setQueue(newQueue);
        }
      }
    );
  }, [playlistId]);

  return queue;
}
