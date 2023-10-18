import { logger } from "./logger";
import ffmpeg from "fluent-ffmpeg";
import { ConfigType, FilterType } from "./config";
import { v4 as uuidv4 } from "uuid";

export const exportShortVideo = async (
  eliminationIndex: number,
  index: string,
  videoPath: string,
  config: ConfigType
) => {
  const output_temp = `${config.processingPath}elimination_${index}.mp4`;
  const output_temp4 = `${config.processingPath}___elimination_${index}.mp4`;
  const output = `${config.outputPath}${uuidv4()}.mp4`;

  const generateVideo = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .seekInput(
        eliminationIndex - config.sequenceDuration + config.timeAfterKillVideo
      )
      .duration(config.sequenceDuration)
      .outputOptions([
        "-vf",
        `scale=-1:${config.shortFormatHeight},crop=${config.shortFormatWidth}:${config.shortFormatHeight}`,
      ])
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

  const applyFilters = async (
    input: string,
    filterConfigs: FilterType[]
  ): Promise<string> => {
    let currentInput = input;

    for (const filterConfig of filterConfigs) {
      const output = `${config.processingPath}${uuidv4()}.mp4`;
      const options =
        filterConfig.timeStart !== undefined
          ? {
              x: `W-w-${filterConfig.positionWidth}`,
              y: `H-h-${filterConfig.positionHeight}`,
              enable: `between(t,${filterConfig.timeStart},${filterConfig.timeEnd})`,
            }
          : {
              x: `W-w-${filterConfig.positionWidth}`,
              y: `H-h-${filterConfig.positionHeight}`,
            };
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(currentInput)
          .input(filterConfig.filterPath)
          .complexFilter({
            filter: "overlay",
            options: options,
            inputs: "[0:v][1:v]",
            outputs: "v",
          })
          .map("[v]")
          .output(output)
          .on("end", () => {
            resolve();
          })
          .on("error", (err) => {
            logger.error(`Error applying filter: ${err}`);
            reject(new Error(err));
          })
          .run();
      });
      currentInput = output;
    }
    return currentInput;
  };

  const outputWithFilters = await applyFilters(
    output_temp,
    config.filterConfigs
  );

  const generateVideoFinal = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(outputWithFilters)
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

// const addGIFFilterEnd = async (
//   input: string,
//   filterFile: string,
//   filter: string,
//   output: string,
//   config: ConfigType
// ) => {
//   const segment1 = `${config.processingPath}cutSegment1.mp4`;
//   const segment2 = `${config.processingPath}cutSegment2.mp4`;
//   const filteredSegment2 = `${config.processingPath}addFilterSegment2.mp4`;

//   const cutSegment1 = new Promise<void>((resolve, reject) => {
//     ffmpeg()
//       .input(input)
//       .inputOptions(["-t 11"])
//       .output(segment1)
//       .on("end", () => {
//         resolve();
//       })
//       .run();
//   });
//   await cutSegment1;

//   const cutSegment2 = new Promise<void>((resolve, reject) => {
//     ffmpeg()
//       .input(input)
//       .inputOptions(["-ss 11"])
//       .output(segment2)
//       .on("end", () => {
//         resolve();
//       })
//       .run();
//   });
//   await cutSegment2;

//   const addFilterSegment2 = new Promise<void>((resolve, reject) => {
//     ffmpeg()
//       .input(segment2)
//       .input(filterFile)
//       .complexFilter(filter)
//       .map("v")
//       .output(filteredSegment2)
//       .on("end", () => {
//         resolve();
//       })
//       .run();
//   });
//   await addFilterSegment2;

//   const finalOutput = new Promise<void>((resolve, reject) => {
//     const command =
//       `ffmpeg -i ${segment1} -c copy -bsf:v h264_mp4toannexb -f mpegts intermediate1.ts && ` +
//       `ffmpeg -i ${filteredSegment2} -c copy -bsf:v h264_mp4toannexb -f mpegts intermediate2.ts && ` +
//       `ffmpeg -i "concat:intermediate1.ts|intermediate2.ts" -c copy -bsf:a aac_adtstoasc ${output}`;

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`Error: ${stderr}`);
//         reject(error);
//       } else {
//         console.log(`Concatenation complete. Output: ${output}`);
//         resolve();
//       }
//     });
//   });
//   await finalOutput;
// };
