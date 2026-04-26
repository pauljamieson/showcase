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
    const containerRef = useRef<HTMLDivElement>(null);

    const intialState: LoaderData = useLoaderData() as LoaderData;

    useEffect(() => {
        setVideos(intialState)
    }, [intialState])

    /* Update videos when fetcher data changes */
    useEffect(() => {
        const newData = fetcher.data as LoaderData;

        //console.log(videos?.files.length, offset)
        if (newData && videos && newData.files.length > 0) {
            setOffset((prev) => prev + 10);
            setVideos({
                videos: [...videos.videos, ...newData.videos],
                files: [...videos.files, ...newData.files]
            });
            setUpdate(true);
        }
    }, [fetcher.data]);




    /* Endless scroll */
    useEffect(() => {



        console.log("Adding scroll listener")

        console.log("Files length:", videos?.files.length, "Offset:", offset)
        const handleWindowScroll = () => {

            const maxHeight = document.documentElement.scrollHeight;
            const position = window.scrollY + window.innerHeight;

            if (update && maxHeight - position < 800) {
                setUpdate(false);

                console.log(`/history?limit=10&offset=${offset + 10}`);
                fetcher.load(`/history?limit=10&offset=${offset + 10}`);
            }
        }

        //const throttledScrollHandler = throttle(handleWindowScroll, 500);

        window.addEventListener('scroll', handleWindowScroll);
        return () => {
            console.log("Removing scroll listener")
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
