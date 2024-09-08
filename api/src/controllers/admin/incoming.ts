import { Request, Response } from "express";
import { basename } from "path";
import {
  opendir,
  stat,
  realpath,
  mkdir,
  rename,
  rmdir,
  unlink,
} from "fs/promises";
import { nanoid } from "nanoid";

import path from "path";
import prisma from "../../lib/prisma";

const VIDEOEXT = [
  ".mp4",
  ".mkv",
  ".mov",
  ".avi",
  ".webm",
  ".wmv",
  ".flv",
  ".mpeg",
];

async function walkTree(folder: string) {
  try {
    const dir = await opendir(folder);
    let files: string[] = [];
    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        files = [
          ...files,
          ...(await walkTree(path.join(dirent.parentPath, dirent.name))),
        ];
      }
      if (dirent.isFile() && VIDEOEXT.includes(path.extname(dirent.name))) {
        files.push(path.join(dirent.parentPath, dirent.name));
      } else if (dirent.isFile())
        await unlink(path.join(dirent.parentPath, dirent.name));
    }
    //await removeEmptyFolders("./app_data/incoming");
    return files;
  } catch (error) {
    throw "Failed to walkTree";
  }
}

async function removeEmptyFolders(folder: string, isRoot = true) {
  try {
    
    const dir = await opendir(folder);
    let hasFiles = false;
    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        await removeEmptyFolders(
          path.join(dirent.parentPath, dirent.name),
          false
        );
      }
      if (dirent.isFile()) hasFiles = true;
    }
    if (isRoot === false && hasFiles === false) await rmdir(folder);
  } catch (error) {
    console.error(error);
  }
}

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
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
    if (!res.locals.isLogged) throw "Not logged in.";
    for (const file of files) {
      const stats = await stat(file);
      const path = await realpath(file);
      const folderId = nanoid(6);
      await mkdir(`./app_data/processing/${folderId}`, { recursive: true });
      await rename(path, `./app_data/processing/${folderId}/${basename(path)}`);
      await prisma.incomingFile.create({
        data: {
          filename: `./app_data/processing/${folderId}/${basename(path)}`,
        }, 
      });
    }
    //await removeEmptyFolders("./app_data/incoming");
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, POST };
