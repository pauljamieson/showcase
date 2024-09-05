import cron from "node-cron";
import prisma from "../lib/prisma";
import Ffmpeg, { ffprobe } from "fluent-ffmpeg";
import { IncomingFile } from "@prisma/client";
import { mkdir, opendir, rename, rm, rmdir } from "fs/promises";
import path from "path";

type FileInfo = {
  filename: string;
  filepath: string;
  duration: number;
  width: number;
  height: number;
  videoCodec: string;
  audioCodec: string;
  size: number;
};

var isActive = false;

async function importFile() {
  try {
    if (isActive) return;
    isActive = true;
    const files = await prisma.incomingFile.findMany();
    for await (const file of files) {
      await processFile(file);
    }
    //await removeEmptyFolders("./app_data/processing");
    isActive = false;
  } catch (error) {
    console.error(error);
    isActive = false;
  }
}

cron.schedule("* * * * *", importFile);

function processFile(file: IncomingFile) {
  return new Promise<boolean>(async (resolve) => {
    console.log(`Processing Start: ${path.basename(file.filename)}`);
    // data for sql create
    var fileInfo: FileInfo;
    try {
      // read file in processing folders
      fileInfo = await getFileInfo(file);

      const isDupe = await isDuplicate(fileInfo);
      if (isDupe) {
        // Delete file\folder from processing and entry from incoming table
        await rm(path.dirname(file.filename), {
          recursive: true,
          force: true,
        });
        await prisma.incomingFile.delete({
          where: {
            id: file.id,
          },
        });
        throw {
          code: 10002,
          msg: `${fileInfo.filename} (${fileInfo.size}) already in database.  Deleting incoming file.`,
        };
      }

      // Create new database entry
      const { id } = await prisma.videoFile.create({ data: fileInfo });

      // Create new folders based on database id
      fileInfo.filepath = `${Math.floor(id / 1000)}/${id % 1000}`;
      const destPath = `./app_data/videos/${fileInfo.filepath}`;
      const newFilePath = `${destPath}/${path.basename(fileInfo.filename)}`;
      await mkdir(`${destPath}/thumbs`, { recursive: true });

      // Move file from processing to destination
      await rename(file.filename, newFilePath);

      // Delete the source folder
      await rm(path.dirname(file.filename), {
        recursive: true,
        force: true,
      });

      // Update table with proper file folder using databse id
      await prisma.videoFile.update({
        where: { id },
        data: {
          filename: fileInfo.filename,
          filepath: fileInfo.filepath,
        },
      });

      // Delete the entry from the incoming table
      await prisma.incomingFile.delete({
        where: {
          id: file.id,
        },
      });

      // generate thumb nails for preview
      await createThumbs(fileInfo.duration, newFilePath, `${destPath}/thumbs`);

      console.log(`Processing End  : ${path.basename(file.filename)}`);
    } catch (error: any) {
      //console.error("Task Error:");
      //console.error(error);
      if (error.code === 10001) {
        console.error(`FFProbe failed for ${file.filename}`);
        console.log(error.msg);
      } else if (error.code === 10002) {
        console.log(error.msg);
      }
    } finally {
      resolve(true);
    }
  });
}

// Get file data used to create new file entry
async function getFileInfo(file: IncomingFile) {
  return new Promise<FileInfo>((resolve, reject) => {
    let info: FileInfo = {
      filename: path.basename(file.filename),
      filepath: "",
      duration: 0,
      width: 0,
      height: 0,
      size: 0,
      videoCodec: "",
      audioCodec: "",
    };

    ffprobe(file.filename, (err, data) => {
      if (err) return reject({ code: 10001, msg: err }); // FFProbe failed

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
        }
      });
      return resolve(info);
    });
  });
}

function createThumbs(
  duration: number,
  soruceFile: string,
  outputPath: string
) {
  return new Promise(async (resolve, reject) => {
    const promises = [];
    for (let x = 0; x < 10; x++) {
      const time = Math.floor((duration / 10) * x);
      promises.push(
        new Promise<boolean>((resolve, reject) => {
          Ffmpeg(soruceFile, { niceness: 15 })
            .screenshot({
              size: "640x?",
              count: 1,
              timemarks: [time],
              filename: `${path.basename(
                soruceFile,
                path.extname(soruceFile)
              )}-${x + 1}.jpg`,
              folder: outputPath,
            })
            .on("error", (error) =>
              console.log(`Thumbnail Encoding Error: ${error.message}`)
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

async function isDuplicate(info: FileInfo) {
  try {
    const isFound = await prisma.videoFile.findFirst({
      where: { filename: info.filename, size: info.size },
    });
    if (!isFound) return false;
    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
}
