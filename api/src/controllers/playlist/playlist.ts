import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

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

async function PUT(req: Request, res: Response) {
  try {
    const {
      fromPosition,
      toPosition,
      playlistId,
    }: { fromPosition: number; toPosition: number; playlistId: number } =
      req.body;

    // Move down in the playlist
    if (fromPosition < toPosition) {
      await prisma.$transaction(async (tx) => {
        // get ordered list of items to avoid unique contraint collision
        const ordered = await prisma.playlistItem.findMany({
          where: {
            playlistId,
            position: { gt: fromPosition, lte: toPosition },
          },
          orderBy: {
            position: "asc",
          },
        });

        // set moved item to -1 to free up position #
        await tx.playlistItem
          .update({
            where: {
              playlistId_position: {
                playlistId: playlistId,
                position: fromPosition,
              },
            },
            data: { position: -1 },
          })
          // loop through items in list and decrement position
          .then(async () => {
            for await (let v of ordered)
              await tx.playlistItem.update({
                where: {
                  playlistId_position: {
                    playlistId: v.playlistId,
                    position: v.position,
                  },
                },
                data: {
                  position: { decrement: 1 },
                },
              });
          })
          // set moved items position
          .then(() =>
            tx.playlistItem.update({
              where: {
                playlistId_position: {
                  playlistId: playlistId,
                  position: -1,
                },
              },
              data: { position: toPosition },
            })
          );
      });
    }

    // Moved up in list
    if (fromPosition > toPosition) {
      await prisma.$transaction(async (tx) => {
        // get ordered list of items to avoid unique contraint collision
        const ordered = await prisma.playlistItem.findMany({
          where: {
            playlistId,
            position: { lt: fromPosition, gte: toPosition },
          },
          orderBy: {
            position: "desc",
          },
        });

        // set moved item to -1 to free up position #
        await tx.playlistItem
          .update({
            where: {
              playlistId_position: {
                playlistId: playlistId,
                position: fromPosition,
              },
            },
            data: { position: -1 },
          })
          // loop through items in list and increment position
          .then(async () => {
            for await (let v of ordered)
              await tx.playlistItem.update({
                where: {
                  playlistId_position: {
                    playlistId: v.playlistId,
                    position: v.position,
                  },
                },
                data: {
                  position: { increment: 1 },
                },
              });
          })
          // set moved items position
          .then(() =>
            tx.playlistItem.update({
              where: {
                playlistId_position: {
                  playlistId: playlistId,
                  position: -1,
                },
              },
              data: { position: toPosition },
            })
          );
      });
    }

    res.json({
      status: "success",
      data: {},
    });
  } catch (error: any) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { GET, PUT };
