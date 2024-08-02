import { Request, Response } from "express";
import { basename } from "path";
import { opendir, stat, realpath, mkdir, rename } from "fs/promises";
import { nanoid } from "nanoid";

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
  const { files } = req.body;
  try {
    for (const file of files) {
      const stats = await stat(file);
      const path = await realpath(file);
      const folderId = nanoid(6);
      await mkdir(`./app_data/processing/${folderId}`, { recursive: true });
      await rename(path, `./app_data/processing/${folderId}/${basename(path)}`);
    }
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, POST };
