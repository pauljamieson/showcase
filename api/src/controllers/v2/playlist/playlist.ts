import { Request, Response } from "express";
import { deletePlaylistById, updatePlaylistName } from "../../../database/database_v2";

async function DELETE(req: Request, res: Response) {
  try {
    
    if (!res.locals.isLogged) throw "Not logged in.";
    //const userId = +res.locals.user;
    const {id} = req.params;
    await deletePlaylistById(+id);
    res.json({
      status: "success",
    });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

async function PUT(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const { id } = req.params;
    const { name } = req.body;
    // Implement the logic to update the playlist order here
    await updatePlaylistName(+id, name);
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure" });
  }
}

export default { DELETE, PUT };
