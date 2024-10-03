import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const userId = +res.locals.user;

    const playlists = await prisma.playlist.findMany({
      where: { userId },

      include: {
        playlistItems: {
          where: { position: 1 },
          include: {
            video: { select: { id: true, filename: true, filepath: true } },
          },
        },
        _count: { select: { playlistItems: true } },
      },
      orderBy: { name: "asc" },
    });
    console.log(playlists);
    res.json({
      status: "success",
      data: { playlists },
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
