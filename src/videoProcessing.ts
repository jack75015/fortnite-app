import { logger } from "./logger";
import * as fs from "fs-extra";
import ffmpeg from "fluent-ffmpeg";
import { ConfigType } from "./config";
import { exportShortVideo } from "./filterProcessing";

export const proccessVideoToImages = async (
  videoPath: string,
  processingPath: string,
  processingPattern: string
) => {
  await fs.emptyDir(processingPath);
  logger.info("processing folder cleaned");

  const process = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .inputFormat("mp4")
      .outputOptions(["-vf", "fps=1"])
      .output(processingPath + processingPattern)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error ${err}`);
        return reject(new Error(err));
      })
      .run();
  });

  await process;
};

export const exportShortVideos = async (
  indexKills: number[],
  videoPath: string,
  index: number,
  config: ConfigType
) => {
  for (let i = 0; i < indexKills.length; i++) {
    const indexKill = indexKills[i];
    await exportShortVideo(indexKill, `${index}_${i + 1}`, videoPath, config);
  }
  logger.info("Export short videos process Done");
};
