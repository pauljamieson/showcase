import { useFetcher, useLoaderData } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { useEffect, useRef, useState } from "react";


type LoaderData = {
    videos: {
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
    }[];
    files: {

        id: number;
        userId: number;
        videoFileId: number;
        watchedAt: Date;
    }[]
};

export type Tag = {
    id: number;
    name: string;
};

export type Person = {
    id: number;
    name: string;
};

export default function History() {
    const fetcher = useFetcher()
    const [videos, setVideos] = useState(null as LoaderData | null);
    const [offset, setOffset] = useState(0);
    const [update, setUpdate] = useState(true);
    const [end, setEnd] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const intialState: LoaderData = useLoaderData() as LoaderData;

    useEffect(() => {
        setVideos(intialState)
    }, [intialState])

    /* Update videos when fetcher data changes */
    useEffect(() => {
        const newData = fetcher.data as LoaderData;
        if (newData && videos && newData.files.length > 0) {
            setOffset((prev) => prev + 10);
            setVideos({
                videos: [...videos.videos, ...newData.videos],
                files: [...videos.files, ...newData.files]
            });
            setUpdate(true);
        } else setEnd(true);
    }, [fetcher.data]);


    /* Endless scroll */
    useEffect(() => {
        const handleWindowScroll = () => {

            const maxHeight = document.documentElement.scrollHeight;
            const position = window.scrollY + window.innerHeight;

            if (update && maxHeight - position < 800) {
                setUpdate(false);
                fetcher.load(`/history?limit=10&offset=${offset + 10}`);
            }
        }

        window.addEventListener('scroll', handleWindowScroll);
        return () => {
            window.removeEventListener('scroll', handleWindowScroll);
        }
    }, [update]);


    return (
        <div className="history-container" >
            <div className="history-card-container" ref={containerRef}  >
                {videos && videos.files.map((file, idx) => {
                    const videoFile = videos.videos.find((v) => v.id === file.videoFileId);
                    return videoFile ? (
                        <div className="history-card" key={idx}>
                            <span>Watched : {new Date(file.watchedAt).toLocaleString()}</span>
                            <VideoCard videoFile={videoFile} />
                        </div>
                    ) : null;
                })}
                {end && <div className="end-message">No more video history.</div>}
            </div>
        </div>
    );
}
