import prisma from "../lib/prisma";

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
