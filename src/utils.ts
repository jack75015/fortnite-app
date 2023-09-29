import * as fs from "fs-extra";
import { logger } from "./logger";
import path from "path";

export const getFilesInDirectory = async (
  processingPath: string
): Promise<string[]> => {
  try {
    const files = await fs.readdir(processingPath);
    return files;
  } catch (error) {
    throw error;
  }
};

export const getMP4Files = async (videoPath: string) => {
  try {
    const files = await fs.readdir(videoPath);
    const mp4Files = files.filter((file) => path.extname(file) === ".mp4");
    return mp4Files;
  } catch (error) {
    logger.info(`getMP4Files error`);
    return [];
  }
};

export const cleanDirectory = async (path: string) => {
  await fs.emptyDir(path);
  logger.info("output folder cleaned");
};

export const smoothValue = (index: number, results: string[]) => {
  const neighbors = 2;
  let sum = 0;
  let count = 0;

  for (
    let i = Math.max(0, index - neighbors);
    i <= Math.min(results.length - 1, index + neighbors);
    i++
  ) {
    if (
      !isNaN(Number(results[i])) &&
      Number(results[i]) >= 0 &&
      Number(results[i]) < 40
    ) {
      sum += Number(results[i]);
      count++;
    }
  }

  if (count > 0) {
    return (sum / count).toString();
  } else {
    return "A";
  }
};
