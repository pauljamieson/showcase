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
import { createIncomingFile } from "../../database/database";

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
      if (dirent.isFile() && VIDEOEXT.includes(path.extname(dirent.name.toLowerCase()))) {
        files.push(path.join(dirent.parentPath, dirent.name));
      } else if (dirent.isFile())
        await unlink(path.join(dirent.parentPath, dirent.name));
    }
    return files;
  } catch (error) {
    console.error(error);
    throw "Failed to walkTree";
  }
}

async function removeEmptyFolders(folder: string) {
  try {
    const dir = await opendir(folder);
    for await (const dirent of dir) {
      if (dirent.isDirectory()) {
        await removeEmptyFolders(path.join(dirent.parentPath, dirent.name));
      }
    }
    const dir2 = await opendir(folder);
    let isEmpty = true;
    for await (const dirent of dir2) {
      isEmpty = false;
    }
    if (isEmpty && folder !== "./app_data/incoming") await rmdir(folder);
  } catch (error) {
    throw "Failed to removeEmptyFolders";
  }
}

async function GET(req: Request, res: Response) {
  try {
    if (!res.locals.isLogged) throw "Not logged in.";
    const files: string[] = await walkTree("./app_data/incoming");
    await removeEmptyFolders("./app_data/incoming");
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
    console.log(res.locals.user);
    if (!res.locals.isLogged) throw "Not logged in.";
    for (const file of files) {
      const stats = await stat(file);
      const path: string = await realpath(file);
      const folderId: string = nanoid(6);
      await mkdir(`./app_data/processing/${folderId}`, { recursive: true });
      await rename(path, `./app_data/processing/${folderId}/${basename(path)}`);
      await createIncomingFile({
        folder: folderId,
        filename: basename(path),
        userId: +res.locals.user,
      });
    }
    await removeEmptyFolders("./app_data/incoming");
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ status: "failure", error });
  }
}

export default { GET, POST };
