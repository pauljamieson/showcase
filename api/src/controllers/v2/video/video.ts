import { Request, Response } from "express";
import { deleteVideoFileById } from "../../../database/database_v2";

async function DELETE(req: Request, res: Response) {
  try {
    const { videoId } = req.body;
    await deleteVideoFileById(videoId);
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}
export default { DELETE };
