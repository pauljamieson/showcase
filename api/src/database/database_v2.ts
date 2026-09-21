import { Prisma, VideoFile } from "@prisma/client";
import prisma from "../lib/prisma";

export async function getVideoFiles({
  skip,
  take,
  include,
  orderBy,
  where,
}: {
  skip?: number;
  take?: number;
  include?: Prisma.VideoFileInclude;
  orderBy?: Prisma.VideoFileOrderByWithRelationInput;
  where?: Prisma.VideoFileWhereInput;
  // select?: Prisma.VideoFileSelect;
}): Promise<VideoFile[]> {
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

export async function deleteVideoFileById(videoId: number) {
  // get playlists that contain the video and remove
  const playlists = await getFilePlaylists(videoId);

  for await (let list of playlists)
    await deletePlaylistItem(videoId, list.playlist.id);
  // delete the video
  await prisma.videoFile.delete({
    where: { id: Number(videoId) },
  });
  // delete tags and people without associated videos
  await deleteTagWithoutVideo();
  await deletePeopleWithoutVideo();
}

export async function deleteTagWithoutVideo() {
  return await prisma.tag.deleteMany({
    where: { videoFiles: { none: {} } },
  });
}

export async function deletePeopleWithoutVideo() {
  return await prisma.person.deleteMany({
    where: { videoFiles: { none: {} } },
  });
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

export async function fixPlaylistPositions(id: number, position: number) {
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

export async function deletePlaylistItem(
  videoId: number,
  playlistId: number,
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
