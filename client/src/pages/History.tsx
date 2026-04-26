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


    const throttle = (func: Function, delay: number) => {
        let lastCall = 0;
        return function (...args: any[]) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        }

    }


    /* Endless scroll */
    useEffect(() => {
        let started = false
        console.log("Calling useEffect for scroll", offset)
        const handleWindowScroll = () => {
            if (started) return

            const maxHeight = document.documentElement.scrollHeight;
            const position = window.scrollY + window.innerHeight;
            /*console.log(maxHeight, position, offset)
            console.log(videos && videos?.files.length, offset, " <> ", (videos?.files.length || 0) < offset)
            console.log("Videos length: ", videos?.files.length)
            console.log(videos)*/
            if (videos && videos?.files.length < offset) return;
            if (maxHeight - position < 200) {
                started = true
                console.log(`/history?limit=10&offset=${offset + 10}`);
                fetcher.load(`/history?limit=10&offset=${offset + 10}`);
                setOffset((prev) => prev + 10);
                started = false;
            }
        }

        const throttledScrollHandler = throttle(handleWindowScroll, 200);

        window.addEventListener('scroll', throttledScrollHandler);
        return () => {
            console.log("Removing scroll listener")
            window.removeEventListener('scroll', throttledScrollHandler);
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
                                <span>{idx} id:{videoFile.id} -  Watched At: {new Date(file.watchedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
}
