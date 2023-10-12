import { logger } from "./logger";
import ffmpeg from "fluent-ffmpeg";
import { ConfigType } from "./config";
import { exec } from "child_process";

// TO REFACTO

export const exportShortVideo = async (
  eliminationIndex: number,
  index: string,
  videoPath: string,
  config: ConfigType
) => {
  const output_temp = `${config.processingPath}elimination_${index}.mp4`;
  const output_temp2 = `${config.processingPath}_elimination_${index}.mp4`;
  const output_temp3 = `${config.processingPath}__elimination_${index}.mp4`;
  const output_temp4 = `${config.processingPath}___elimination_${index}.mp4`;
  const output = `${config.outputPath}elimination_${index}.mp4`;

  const filter_begin = `${config.filterPath}subscribe2.gif`;
  const filter_end = `${config.filterPath}like2.gif`;
  const filter_constant = `${config.filterPath}name.psd`;

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

  const addFilterName = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(output_temp)
      .input(filter_constant)
      // .complexFilter("[0:v][1:v]overlay=W-w-10:H-h-10[v]")
      .input(filter_end)
      .complexFilter(
        "[0:v][1:v]overlay=W-w-10:H-h-10[overlay1];[overlay1][2:v]overlay=W-w-50:H-h-310[v]"
      )
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
  });
  await addFilterName;

  const addFilterBegin = new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(output_temp2)
      .input(filter_begin)
      .complexFilter({
        filter: "overlay",
        options: {
          x: "W-w-640",
          y: "H-h-40",
          enable: `between(t,0,4)`,
        },
        inputs: "[0:v][1:v]",
        outputs: "v",
      })
      .map("v")
      .output(output_temp3)
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        logger.error(`Error ${err}`);
        return reject(new Error(err));
      })
      .run();
  });
  await addFilterBegin;

  // const addFilterEnd = new Promise<void>((resolve, reject) => {
  //   ffmpeg()
  //     .input(output_temp3)
  //     .input(filter_end)
  //     .complexFilter({
  //       filter: "overlay",
  //       options: {
  //         x: "W-w-640",
  //         y: "H-h-40",
  //         enable: `between(t,13,15)`,
  //       },
  //       inputs: "[0:v][1:v]",
  //       outputs: "v",
  //     })
  //     .map("v")
  //     .output(output_temp4)
  //     .on("end", () => {
  //       resolve();
  //     })
  //     .on("error", (err) => {
  //       logger.error(`Error ${err}`);
  //       return reject(new Error(err));
  //     })
  //     .run();
  // });
  // await addFilterEnd;

  // await addGIFFilterEnd(
  //   output_temp3,
  //   filter_end,
  //   "[0:v][1:v]overlay=W-w-10:H-h-10[v]",
  //   output_temp4,
  //   config
  // );

  const generateVideoFinal = new Promise<void>((resolve, reject) => {
    ffmpeg()
      // .input(output_temp4)
      .input(output_temp3)
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
