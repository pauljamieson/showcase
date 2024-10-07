import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await prisma.playlist.findFirst({
      where: { id: +id },
      include: {
        playlistItems: {
          include: {
            video: {
              select: {
                duration: true,
                filename: true,
                filepath: true,
                id: true,
                views: true,
              },
            },
          },
        },
      },
    });
    res.json({
      status: "success",
      data: { playlist: result },
    });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET };
