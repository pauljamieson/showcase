import cron from "node-cron";
import Ffmpeg from "fluent-ffmpeg";
import { VideoFile, ConvertVideo } from "@prisma/client";
import { mkdir, rename, rm } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
import {
  deleteConvertVideoById,
  deleteVideoFileById,
  getConvertVideos,
  getVideoFileById,
} from "../database/database";

cron.schedule("* * * * *", convertFile);

var isActive = false;

async function convertFile() {
  try {
    // only allow one instance to run at a time
    if (isActive) return;
    isActive = true;
    // get current list of files to convert
    const files = await getConvertVideos({});

    // convert list of files
    for await (const file of files) {
      await processFile(file);
    }

    isActive = false;
  } catch (error) {
    console.error(error);
    isActive = false;
  }
}

async function processFile(file: ConvertVideo) {
  return new Promise<boolean>(async (resolve) => {
    const INCOMINGFOLDER = "./app_data/incoming";
    try {
      // get video file info
      await getVideoFileById(file.videoFileId);
      const video: VideoFile = await getVideoFileById(file.videoFileId);
      
      // create source and destination (in processing) paths
      const src = path.join(
        "./app_data/videos",
        video.filepath,
        video.filename
      );
      let dst = path.join(
        "./app_data/processing/",
        file.id.toString(),
        path.basename(video.filename, path.extname(video.filename)) +
          "-[x265].mp4"
      );

      // Remove x264 from file name and make folder in processing
      dst = dst.replace(/[-\[]*x264[-\]]*/, "");
      await mkdir(path.dirname(dst), { recursive: true });

      // Convert the video file
      Ffmpeg(src)
        .videoCodec("libx265")
        .addOption("-crf 20")
        .output(dst)
        .on("error", (error) => console.error(error))
        .on("end", async (end) => {
          // Move to incoming
          const incPath = path.join(INCOMINGFOLDER, nanoid(6));
          await mkdir(incPath, { recursive: true });
          await rename(dst, path.join(incPath, path.basename(dst)));
          // Delete all work files\database entries
          await deleteConvertVideoById(file.id);
          await deleteVideoFileById(file.videoFileId);
          await rm(path.dirname(src), { recursive: true });

          resolve(true);
        })
        .run();
    } catch (error: any) {
      console.error(error);
    }
  });
}
