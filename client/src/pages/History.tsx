import { useLoaderData } from "react-router-dom";
import VideoCard from "../components/VideoCard";


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

    const videos: LoaderData = useLoaderData() as LoaderData;

    console.log(videos && videos);

    return (
        <div className="videos-container" >
            <div className="video-card-container  ">
                {videos && videos.files.map((file) => {
                    const videoFile = videos.videos.find((v) => v.id === file.videoFileId);
                    return videoFile ? (
                        <div key={file.id}>
                            <VideoCard key={file.id} videoFile={videoFile} />
                            <span>Watched At: {new Date(file.watchedAt).toLocaleString()}</span>
                        </div>
                    ) : null;
                })}
            </div>
        </div>
    );
}
