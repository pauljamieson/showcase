import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { deletePlaylistItem } from "../../lib/database";
import {
  createPlaylist,
  createPlaylistItem,
  getPlaylistsByUserId,
  getPlaylistsByUserIdWithVideoId,
} from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const userId = +res.locals.user;
    const { name, videoId, intent, lists } = req.body;

    // create a new playlist and put video in 1 position
    if (intent === "create") {
      const { id } = await createPlaylist(name, userId);
      await createPlaylistItem(id, +videoId);
    }

    if (intent === "add") {
      // get lists that are in but not anymore
      const initPlaylists = await getPlaylistsByUserIdWithVideoId(
        userId,
        +videoId
      );
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
          await createPlaylistItem(+id, +videoId);
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
    // video id
    const { id } = req.params;
    // get list of all playlists
    const playlists = await getPlaylistsByUserId(userId);
    // get list of playlists the video is in
    const inList = await getPlaylistsByUserIdWithVideoId(userId, +id);

    res.json({
      status: "success",
      data: { playlists, inList: inList.map((v) => v.id) },
    });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET, POST };
