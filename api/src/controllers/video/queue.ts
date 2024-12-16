import { Request, Response } from "express";
import prisma from "../../lib/prisma";

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";

    const playlist = req.query.playlist as string;

    // get entries for playlist or random videos
    const list = playlist
      ? await getPlaylistVideos(+playlist)
      : await getRandomVideos();

    res.json({
      status: "success",
      data: { queue: list },
    });
  } catch (error) {
    console.error(error);
    console.log("ERRRRROOOORRRRRRR");
    res.json({ status: "failure" });
  }
}

async function getPlaylistVideos(playlist: number) {
  return new Promise(async (resolve, reject) => {
    prisma.playlist
      .findFirst({
        where: { id: playlist },
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
      })
      .then((v) => {
        return v?.playlistItems
          .map((item, idx) => {
            return { ...item.video, position: item.position };
          })
          .sort((a, b) => a.position - b.position);
      })
      .then((q) => resolve(q))
      .catch((err) => reject(err));
  });
}

async function getRandomVideos(take: number = 10) {
  return new Promise(async (resolve, reject) => {
    const count = await prisma.videoFile.count();

    const numbers: number[] = [];
    // get 10 random videos to put into suggestions\queue
    // if less then 10 videos in db allow repeats
    while (numbers.length < 10) {
      const num = Math.floor(Math.random() * count);
      if (count > 9 && !numbers.includes(num)) numbers.push(num);
      else if (count < 10) numbers.push(num);
    }

    const promises = numbers.map(
      async (val) =>
        await prisma.videoFile.findFirst({
          select: {
            duration: true,
            filename: true,
            filepath: true,
            id: true,
            views: true,
          },
          skip: val,
          orderBy: { id: "asc" },
        })
    );
    const resolved = await Promise.all(promises);
    const results = resolved.map((v, i) => {
      return { ...v, position: i + 1 };
    });

    resolve(results);
  });
}

export default { GET };
