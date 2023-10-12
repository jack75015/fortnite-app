import sharp from "sharp";
import Tesseract from "tesseract.js";

export const cropToEliminationCounter = async (
  imagePath: string,
  coordinates_kills: any
): Promise<Buffer> => {
  const buffer = await sharp(imagePath)
    .withMetadata({ density: 300 })
    .extract({
      left: coordinates_kills.x,
      top: coordinates_kills.y,
      width: coordinates_kills.width,
      height: coordinates_kills.height,
    })
    .resize(800)
    .grayscale()
    .normalize()
    .sharpen()
    .median(3)
    .toBuffer();

  return buffer;
};

export const extractTextFromImage = async (
  imagePath: Buffer
): Promise<string> => {
  const {
    data: { text },
  } = await Tesseract.recognize(imagePath, "eng", {
    tessedit_char_whitelist: "0123456789",
  } as any);
  return text;
};

const processImageBatch = async (
  batch: string[],
  processingPath: string,
  coordinates_kills: any
): Promise<string[]> => {
  const batchPromises = batch.map(async (imagePath) => {
    const croppedImage = await cropToEliminationCounter(
      processingPath + imagePath,
      coordinates_kills
    );
    const extractionResult = await extractTextFromImage(croppedImage);
    return extractionResult;
  });

  return Promise.all(batchPromises);
};

export const processImagesInBatches = async (
  imagePaths: string[],
  batchSize: number,
  processingPath: string,
  coordinates_kills: any
): Promise<string[]> => {
  const results: string[] = [];
  for (let i = 0; i < imagePaths.length; i += batchSize) {
    const batch = imagePaths.slice(i, i + batchSize);
    const batchResults = await processImageBatch(
      batch,
      processingPath,
      coordinates_kills
    );
    results.push(...batchResults);
  }
  return results;
};
