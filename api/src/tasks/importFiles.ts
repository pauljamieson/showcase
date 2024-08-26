import cron from "node-cron";
import prisma from "../lib/prisma";
import Ffmpeg, { ffprobe } from "fluent-ffmpeg";
import { IncomingFile } from "@prisma/client";
import { mkdir, opendir, rename, rm, rmdir, unlink } from "fs/promises";
import path from "path";

let isActive = false;

async function importFile() {
  try {
    if (isActive) return;
    isActive = true;
    const files = await prisma.incomingFile.findMany();
    for await (const file of files) {
      await processFile(file);
    }
    await removeEmptyFolders("./app_data/processing");
  } catch (error) {
    console.error(error);
  } finally {
    isActive = false;
  }
}

cron.schedule("* * * * *", importFile);

function processFile(file: IncomingFile) {
  return new Promise<boolean>(async (resolve) => {
    var fileInfo: FileInfo;
    try {
      fileInfo = await getFileInfo(file);
      const { id } = await prisma.videoFile.create({ data: fileInfo });
      const filePath = `./app_data/videos/${Math.floor(id / 1000)}/${
        id % 1000
      }`;
      const newPath = `${filePath}/${path.basename(fileInfo.filename)}`;
      await mkdir(`${filePath}/thumbs`, { recursive: true });
      await createThumbs(fileInfo, `${filePath}/thumbs`);
      await rename(fileInfo.filename, newPath);
      await rm(path.dirname(fileInfo.filename), {
        recursive: true,
        force: true,
      });
      await prisma.videoFile.update({
        where: { id },
        data: { filename: newPath },
      });
      await prisma.incomingFile.delete({
        where: {
          id: file.id,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        fileInfo = await getFileInfo(file);
        await rm(path.dirname(fileInfo.filename), {
          recursive: true,
          force: true,
        });
        await prisma.incomingFile.delete({
          where: {
            id: file.id,
          },
        });
      }
      if (error.code === "P2025") {
      }
    } finally {
      resolve(true);
    }
  });
}

type FileInfo = {
  filename: string;
  duration: number;
  width: number;
  height: number;
  videoCodec: string;
  audioCodec: string;
  size: number;
};

async function getFileInfo(file: IncomingFile) {
  return new Promise<FileInfo>((resolve) => {
    let info: FileInfo = {
      filename: file.filename,
      duration: 0,
      width: 0,
      height: 0,
      size: 0,
      videoCodec: "",
      audioCodec: "",
    };
    ffprobe(file.filename, (err, data) => {
      if (err) return console.error(err);
      info.duration = Math.floor(data.format.duration!);
      info.size = data.format.size!;
      data.streams.forEach((val) => {
        switch (val.codec_type) {
          case "video":
            info.height = val.coded_height!;
            info.width = val.coded_width!;
            info.videoCodec = val.codec_name!;
            break;
          case "audio":
            info.audioCodec = val.codec_name!;
            break;
          default:
            console.error(val.codec_type);
        }
      });
      return resolve(info);
    });
  });
}

function createThumbs(fileInfo: FileInfo, outputPath: string) {
  return new Promise(async (resolve, reject) => {
    const promises = [];
    for (let x = 0; x < 10; x++) {
      const time = Math.floor((Number(fileInfo.duration) / 10) * x);
      promises.push(
        new Promise<boolean>((resolve, reject) => {
          Ffmpeg(fileInfo.filename, { niceness: 15 })
            .screenshot({
              size: "640x?",
              count: 1,
              timemarks: [time],
              filename: `${path.basename(
                fileInfo.filename,
                path.extname(fileInfo.filename)
              )}-${x + 1}.jpg`,
              folder: outputPath,
            })
            .on("error", (error) =>
              console.log(`Encoding Error: ${error.message}`)
            )
            .on("end", () => resolve(true));
        })
      );
    }
    Promise.all(promises).then(() => resolve(true));
  });
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
  } catch (error) {}
}
