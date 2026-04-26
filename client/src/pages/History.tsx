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
    const containerRef = useRef<HTMLDivElement>(null);

    const intialState: LoaderData = useLoaderData() as LoaderData;

    useEffect(() => {
        setVideos(intialState)
    }, [intialState])

    /* Update videos when fetcher data changes */
    useEffect(() => {
        const newData = fetcher.data as LoaderData;

        console.log(videos?.files.length, offset)
        if (newData && videos && videos?.videos.length <= offset) {
            setVideos({
                videos: [...videos.videos, ...newData.videos],
                files: [...videos.files, ...newData.files]
            });
        }
    }, [fetcher.data]);


    /* Endless scroll */
    useEffect(() => {
        console.log("Calling useEffect for scroll", offset)
        const handleWindowScroll = () => {
            const maxHeight = document.documentElement.scrollHeight;
            const position = window.scrollY + window.innerHeight;
            console.log(maxHeight, position, offset)
            console.log(videos && videos?.files.length, offset)
            if (videos && videos?.files.length < offset) return;
            if (maxHeight - position < 200) {
                setOffset((prev) => prev + 10);
                fetcher.load(`/history?limit=10&offset=${offset + 10}`);

            }
        }

        window.addEventListener('scroll', handleWindowScroll);
        return () => {
            console.log("Removing scroll listener")
            window.removeEventListener('scroll', handleWindowScroll);
        }
    }, [offset]);


    return (
        <div className="history-container" >
            <div className="history-card-container" ref={containerRef}  >
                {videos && videos.files.map((file, idx) => {
                    const videoFile = videos.videos.find((v) => v.id === file.videoFileId);
                    return videoFile ? (
                        <div className="history-card" key={idx}>
                            <div>
                                <VideoCard videoFile={videoFile} />
                                <span>{idx} -  Watched At: {new Date(file.watchedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
}
