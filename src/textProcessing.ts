import { logger } from "./logger";
import { smoothValue } from "./utils";

export const processDataImages = (imagesProcessed: string[]): string[] => {
  const results = [];

  for (let index = 0; index < imagesProcessed.length; index++) {
    let image = imagesProcessed[index];

    image = image
      .replace(/(\r\n|\n|\r)/gm, "")
      .replace(/[Oo]/g, "0")
      .replace(/[Ll]/g, "1");

    if (isNaN(Number(image)) || Number(image) < 0 || Number(image) >= 40) {
      const smoothedValue = smoothValue(index, imagesProcessed);
      results.push(smoothedValue);
    } else {
      results.push(image);
    }
  }
  const goodResult = results.filter((x) => x !== "A").length;
  logger.info(
    `Image processed success rate: ${Number.parseFloat(
      ((goodResult / imagesProcessed.length) * 100).toFixed(2)
    )} `
  );
  return results;
};

export const detectEliminations = (data: string[]): number[] => {
  const results: number[] = [];
  let consecutiveCount = 0;
  let currentNumber = null;
  let index = 1;
  for (let i = 0; i < data.length; i++) {
    const number = data[i];

    if (number === currentNumber) {
      consecutiveCount++;

      if (consecutiveCount === 3 && Number(number) === index) {
        logger.info(`kill ${index} detected to index ${i - 2}`);
        results.push(i - 2);
        consecutiveCount = 0;
        index++;
      }
    } else {
      currentNumber = number;
      consecutiveCount = 1;
    }
  }
  return results;
};
