import { logger } from "./logger";
import * as fs from "fs-extra";
import ffmpeg from "fluent-ffmpeg";
import { ConfigType } from "./config";

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

export const exportShortVideo = async (
  eliminationIndex: number,
  index: string,
  videoPath: string,
  config: ConfigType
) => {
  const output_temp = `${config.processingPath}elimination_${index}.mp4`;
  const output_temp2 = `${config.processingPath}_elimination_${index}.mp4`;

  const output = `${config.outputPath}elimination_${index}.mp4`;

  const generateVideo = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .seekInput(
        eliminationIndex - config.sequenceDuration + config.timeAfterKillVideo
      )
      .duration(config.sequenceDuration)
      .outputOptions(["-vf", "scale=-1:1440,crop=1080:1440"])
      .output(output_temp)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error ${err}`);
        return reject(new Error(err));
      })
      .run();
  });
  await generateVideo;

  const generateVideoWithFilterButSadlyNoSound = new Promise<void>(
    (resolve, reject) => {
      ffmpeg()
        .input(output_temp)
        .input(config.filterPath)
        .complexFilter("[0:v][1:v]overlay=W-w-10:H-h-10[v]")
        .map("[v]")
        .output(output_temp2)
        .on("end", () => {
          resolve();
        })
        .on("error", (err) => {
          logger.error(`Error ${err}`);
          return reject(new Error(err));
        })
        .run();
    }
  );
  await generateVideoWithFilterButSadlyNoSound;

  const generateVideoFinal = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(output_temp2)
      .input(output_temp)
      .output(output)
      .outputOptions(["-map 0:v", "-map 1:a", "-c:v copy", "-shortest"])
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error ${err}`);
        return reject(new Error(err));
      })
      .run();
  });
  await generateVideoFinal;
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

/*

export const exportShortVideo = async (
  eliminationIndex: number,
  eliminationPosition: number,
  index: string,
  videoPath: string,
  config: ConfigType
) => {
  const output_temp = `${config.processingPath}elimination_${index}.mp4`;
  const output_temp2 = `${config.processingPath}_elimination_${index}.mp4`;

  const output = `${config.outputPath}elimination_${index}.mp4`;

  const generateVideo = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(config.filterPath) // Ajouter votre filtre comme une autre entrée
      .seekInput(eliminationIndex - eliminationPosition)
      .duration(config.sequenceDuration)
      .outputOptions(["-vf", "scale=-1:1440,crop=1080:1440"])
      .output(output_temp)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error ${err}`);
        return reject(new Error(err));
      })
      .run();
  });
  await generateVideo;

  const generateVideoWithFilterButSadlyNoSound = new Promise<void>(
    (resolve, reject) => {
      ffmpeg()
        .input(output_temp)
        .input(config.filterPath)
        .complexFilter("[0:v][1:v]overlay=W-w-10:H-h-10[v]")
        .map("[v]")
        .output(output_temp2)
        .on("end", () => {
          resolve();
        })
        .on("error", (err) => {
          logger.error(`Error ${err}`);
          return reject(new Error(err));
        })
        .run();
    }
  );
  await generateVideoWithFilterButSadlyNoSound;

  const generateVideoFinal = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(output_temp2)
      .input(output_temp)
      .output(output)
      .outputOptions(["-map 0:v", "-map 1:a", "-c:v copy", "-shortest"])
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error ${err}`);
        return reject(new Error(err));
      })
      .run();
  });
  await generateVideoFinal;
};

*/
