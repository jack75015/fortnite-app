import app from "./app";
import * as fs from "fs-extra";
import path from "path";
import { logger } from "./logger";
import { processImagesInBatches } from "./imageProcessing";
import { exportShortVideos, proccessVideoToImages } from "./videoProcessing";
import { cleanDirectory, getFilesInDirectory, getMP4Files } from "./utils";
import { detectEliminations, processDataImages } from "./textProcessing";
import { config } from "./config";
const port = 3000;

const processImages = async (imagePaths: string[]): Promise<string[]> => {
  const startTime: number = Date.now();

  logger.info("processImages started ...");

  const results = await processImagesInBatches(
    imagePaths,
    config.batchSize,
    config.processingPath,
    config.coordinates_kills
  );

  const diff = Date.now() - startTime;
  logger.info(`processImages finish in ${diff / 1000} seconds`);
  return results;
};

const processVideo = async (videoPath: string, index: number) => {
  const startTime: number = Date.now();

  logger.info(`process started for ${videoPath}`);
  await proccessVideoToImages(
    videoPath,
    config.processingPath,
    config.processingPattern
  );
  const files = await getFilesInDirectory(config.processingPath);
  const imagesProcessed = await processImages(files);

  const dataImagesProcessed = processDataImages(imagesProcessed);

  const indexKills = detectEliminations(dataImagesProcessed);
  await exportShortVideos(indexKills, videoPath, index, config);
  const endTime = Date.now();
  const diff = endTime - startTime;
  logger.info(`process finish in ${diff / 1000} seconds for ${videoPath}`);
};

const start = async () => {
  const startTime: number = Date.now();
  const files = await getMP4Files(config.videoPath);
  if (files.length === 0) {
    logger.info(`No video in the folder ${config.videoPath}`);
    process.exit();
  }
  await cleanDirectory(config.outputPath);
  let index = 1;
  for (const file of files) {
    const filePath = path.join(config.videoPath, file);

    if (file.endsWith(".mp4")) {
      await processVideo(filePath, index);
      index++;
    }
  }
  const endTime = Date.now();
  const diff = endTime - startTime;
  logger.info(`All Process finish in ${diff / 1000} seconds`);
  await fs.emptyDir(config.processingPath);
  process.exit();
};

app.listen(port, async () => {
  logger.info(`Server is listening at http://localhost:${port}`);
  await start();
});
