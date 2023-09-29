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

export const processImagesInBatches = async (
  imagePaths: any,
  batchSize: any,
  processingPath: string,
  coordinates_kills: any
) => {
  const results = [];
  let batch = [];

  for (const imagePath of imagePaths) {
    batch.push(imagePath);

    if (batch.length === batchSize) {
      const batchPromises = batch.map(async (imagePath) => {
        const croppedImage = await cropToEliminationCounter(
          processingPath + imagePath,
          coordinates_kills
        );
        const extractionResult = await extractTextFromImage(croppedImage);
        return extractionResult;
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      batch = [];
    }
  }

  if (batch.length > 0) {
    const batchPromises = batch.map(async (imagePath) => {
      const croppedImage = await cropToEliminationCounter(
        processingPath + imagePath,
        coordinates_kills
      );
      const extractionResult = await extractTextFromImage(croppedImage);
      return extractionResult;
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
};
