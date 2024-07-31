import { Request, Response } from "express";
import { opendir } from "fs/promises";
import path from "path";

async function walkTree(folder: string) {
  const dir = await opendir(folder);
  let files: string[] = [];
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      files = [
        ...files,
        ...(await walkTree(path.join(dirent.parentPath, dirent.name))),
      ];
    }
    if (dirent.isFile()) {
      files.push(path.join(dirent.parentPath, dirent.name));
    }
  }
  return files;
}

async function GET(req: Request, res: Response) {
  try {
    const files: string[] = await walkTree("./app_data/incoming");
    files.sort();
    res.setHeader("Authorization", `${req.header("Authorization")}`);

    res.json({ status: "success", data: { files } });
  } catch (error) {
    res.json({ status: "failure", error });
  }
}

async function POST(req: Request, res: Response) {
  try {
  } catch (error) {
    res.json({ status: "failure", error });
  }
}

export default { GET };
