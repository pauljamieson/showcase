import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { deletePlaylistItem } from "../../lib/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const userId = +res.locals.user;
    const { name, videoId, intent, lists } = req.body;

    // create a new playlist and put video in 1 position
    if (intent === "create") {
      const { id } = await prisma.playlist.create({
        data: {
          name: name,
          user: { connect: { id: +res.locals.user } },
        },
      });

      await prisma.playlistItem.create({
        data: { videoId: +videoId, playlistId: id, position: 1 },
      });
    }

    if (intent === "add") {
      // get lists that are in but not anymore
      const initPlaylists = await prisma.playlist.findMany({
        where: {
          userId: +userId,
          playlistItems: { some: { videoId: +videoId } },
        },
        select: { id: true },
      });
      // Delete playlist item if removed from playlist
      const initPlaylistNums = initPlaylists.map((v) => v.id);
      const curPlaylistNums: [number] = lists.map(Number);

      initPlaylistNums.map(async (init) => {
        if (!curPlaylistNums.includes(init)) {
          await deletePlaylistItem({ playlistId: init, videoId: +videoId });
        }
      });

      // Add to playlists in last position if not in list already
      lists.map(async (id: string) => {
        try {
          // get last position in playlist
          const {
            _max: { position },
          } = await prisma.playlistItem.aggregate({
            where: { playlistId: +id },
            _max: { position: true },
          });

          // add item to playlist in last position
          await prisma.playlistItem.upsert({
            where: {
              videoId_playlistId: {
                videoId: +videoId,
                playlistId: +id,
              },
            },
            create: {
              videoId: +videoId,
              playlistId: +id,
              position: position! + 1,
            },
            update: {}, // already in list, do nothing
          });
        } catch (error) {
          console.error(error);
        }
      });
    }

    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function GET(req: Request, res: Response) {
  try {
    const userId = +res.locals.user;
    const { id } = req.params;

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      select: { id: true, name: true },
    });

    // get list of playlists the video is in
    const inList = await prisma.playlistItem.findMany({
      where: { videoId: +id },
      select: { playlistId: true },
    });

    res.json({
      status: "success",
      data: { playlists, inList: inList.map((v) => v.playlistId) },
    });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET, POST };
