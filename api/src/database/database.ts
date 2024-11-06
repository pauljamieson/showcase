import {
  Playlist,
  Prisma,
  VideoFile,
  VideoRatings,
  Tag,
  Person,
} from "@prisma/client";
import prisma from "../lib/prisma";
import { create } from "domain";

/* PLAYLIST */

interface GetPlaylistPanel {
  playlist?: number;
  position: number;
  take: number;
}

export async function getPlaylistPanel({
  playlist,
  position = 0,
  take = 10,
}: GetPlaylistPanel) {
  if (playlist) {
    const list = await prisma.playlist.findFirst({
      where: { id: playlist },
      select: { playlistItems: { select: { position: true, video: true } } },
    });
  } else {
    const count = await prisma.videoFile.count();
    let rand = count;
    const videos = [];
    let total = 0;
    while (total < take) {
      while (rand >= count - 10) {
        rand = Math.floor(Math.random() * count);
      }
      videos.push(rand);
      total += 1;
    }

    return await prisma.videoFile.findMany({
      select: {
        duration: true,
        filename: true,
        filepath: true,
        id: true,
        views: true,
      },
      take,
      skip: rand,
    });
  }
}

export async function deleteVideo(id: number) {
  // get all play lists
  const lists = await getFilePlaylists(id);
  // delete video for all play lists
  for await (let list of lists) await deletePlaylistItem(id, list.playlist.id);
  await prisma.videoFile.delete({ where: { id: id } });
  await deleteTagWithoutVideo();
  await deletePeopleWithoutVideo();
}

export async function getFilePlaylists(id: number): Promise<
  {
    playlist: { id: number };
    position: number;
  }[]
> {
  return await prisma.playlistItem.findMany({
    where: { videoId: id },
    select: {
      playlist: { select: { id: true } },
      position: true,
    },
  });
}

export async function deletePlaylistItem(
  videoId: number,
  playlistId: number
): Promise<{}> {
  const result = await prisma.playlistItem.delete({
    where: {
      videoId_playlistId: {
        videoId,
        playlistId,
      },
    },
    select: {
      playlistId: true,
      position: true,
    },
  });
  await fixPlaylistPositions(result.playlistId, result.position);
  return {};
}

async function fixPlaylistPositions(id: number, position: number) {
  // get items that come in playlist after deleted item
  const items = await prisma.playlistItem.findMany({
    where: { playlistId: id, position: { gte: position } },
    orderBy: { position: "asc" },
  });

  // decrement position by 1 to back fill positions
  for await (let item of items)
    await prisma.playlistItem.update({
      where: { id: item.id },
      data: { position: { decrement: 1 } },
    });
}

/* TAGS */

export async function getTagByName(name: string) {
  return await prisma.tag.findFirst({ where: { name: name } });
}

export async function getTagById(id: number) {
  return await prisma.tag.findFirst({ where: { id: id } });
}

export async function getTags() {
  return await prisma.tag.findMany();
}

export async function getTagsByVideoId(id: number) {
  return await prisma.tag.findMany({
    where: { videoFiles: { some: { id: id } } },
  });
}

export async function createTag(name: string, videoId: number) {
  return await prisma.tag.upsert({
    where: { name: name },
    create: {
      name: name,
      creator: { connect: { id: 1 } },
      videoFiles: { connect: { id: videoId } },
    },
    update: { videoFiles: { connect: { id: videoId } } },
  });
}

export async function deleteTagById(id: number) {
  return await prisma.tag.delete({ where: { id: id } });
}

export async function deleteTagByName(name: string) {
  return await prisma.tag.delete({ where: { name: name } });
}

export async function deleteTagWithoutVideo() {
  return await prisma.tag.deleteMany({
    where: { videoFiles: { none: {} } },
  });
}

/* People */

export async function getPersonByName(name: string) {
  return await prisma.person.findFirst({ where: { name: name } });
}

export async function getPersonById(id: number) {
  return await prisma.person.findFirst({ where: { id: id } });
}

export async function getPeople() {
  return await prisma.person.findMany();
}

export async function deletePeopleWithoutVideo() {
  return await prisma.person.deleteMany({
    where: { videoFiles: { none: {} } },
  });
}
/* Video File */

interface CreateVideoFile {
  filename: string;
  filepath: string;
  duration: number;
  width: number;
  height: number;
  videoCodec: string;
  audioCodec: string;
  size: number;
}

export async function createVideoFile({
  filename,
  filepath,
  duration,
  width,
  height,
  videoCodec,
  audioCodec,
  size,
}: CreateVideoFile): Promise<VideoFile> {
  return await prisma.videoFile.create({
    data: {
      filename: filename,
      filepath: filepath,
      duration: duration,
      width: width,
      height: height,
      videoCodec: videoCodec,
      audioCodec: audioCodec,
      size: size,
    },
  });
}

export async function getVideoFileById(id: number) {
  return await prisma.videoFile.findFirst({ where: { id: id } });
}

export async function getVideoFile(data: Prisma.VideoFileWhereInput) {
  return await prisma.videoFile.findFirst({ where: data });
}

interface GetVideoFiles {
  skip?: number;
  take?: number;
  include?: Prisma.VideoFileInclude;
  orderBy?: Prisma.VideoFileOrderByWithRelationInput;
  where?: Prisma.VideoFileWhereInput;
  select?: Prisma.VideoFileSelect;
}

interface GetVideoFileReturn extends VideoFile {
  ratings?: VideoRatings[];
  tags?: Tag[];
  people?: Person[];
}

export async function getVideoFiles({
  skip,
  take,
  include,
  orderBy,
  where,
}: GetVideoFiles): Promise<GetVideoFileReturn[]> {
  return await prisma.videoFile.findMany({
    skip,
    take,
    include,
    orderBy,
    where,
  });
}

export async function getVideoFilesCount(where: Prisma.VideoFileWhereInput) {
  return await prisma.videoFile.count({ where });
}

interface UpdateVideoFile {
  id: number;
  data: Prisma.VideoFileUpdateInput;
}

export async function updateVideoFile({ id, data }: UpdateVideoFile) {
  return await prisma.videoFile.update({
    where: { id },
    data: data,
  });
}

export async function deleteVideoFileById(id: number) {
  // delete all playlist entries
  // delete video file
}

/* Incoming File */

export async function deleteIncomingFileById(id: number) {
  return await prisma.incomingFile.delete({ where: { id: id } });
}
