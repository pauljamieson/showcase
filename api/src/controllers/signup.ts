import { Request, Response } from "express";

function GET(req: Request, res: Response) {
  res.json({ status: "success" });
}

export { GET };
