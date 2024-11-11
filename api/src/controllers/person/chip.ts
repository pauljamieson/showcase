import { Request, Response } from "express";
import {
  countPersonConnectionsById,
  deletePersonById,
  updatePersonById,
} from "../../database/database";

async function POST(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { personId, videoId }: { personId: string; videoId: string } =
      req.body;

    const query = {
      where: { id: +personId },
      data: {
        videoFiles: {
          delete: {
            videoId_personId: { videoId: +videoId, personId: +personId },
          },
        },
      },
    };

    const r = await updatePersonById(query);
    const count = await countPersonConnectionsById(+personId);

    if (count === 0) {
      await deletePersonById(+personId);
    }
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { POST };
