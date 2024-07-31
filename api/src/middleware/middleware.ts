import { NextFunction } from "express";
const SECRET = process.env.SECRET || "This is not good enough";

export default function (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.get("Authorization") || "";
 
  next();
}
