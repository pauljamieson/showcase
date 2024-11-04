export interface Person {
  person: {
    id: number;
    name: string;
  };
}

export interface Tag {
  tag: {
    id: number;
    name: string;
  };
}

export interface VideoData {
  id: number;
  filename: string;
  filepath: string;
  videoCodec: string;
  height: number;
  width: number;
  audioCodec: string;
  duration: number;
  size: number;
  views: number;
  rating: { rating: number; userRating: number };
  people: Person[];
  tags: Tag[];
  updatedAt: string;
  createdAt: string;
}

export interface Playlist {
  id: number;
  name: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  playlistItems: PlaylistItem[];
}

export interface PlaylistItem {
  id: number;
  position: number;
  videoId: number;
  playlistId: number;
  createdAt: Date;
  updatedAt: Date;
  video: Video;
}

export interface Video {
  duration: number;
  filename: string;
  filepath: string;
  id: number;
  views: number;
}
