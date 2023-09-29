export type CoordinatesKillsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ConfigType = {
  videoPath: string;
  outputPath: string;
  processingPath: string;
  filterPath: string;
  processingPattern: string;
  sequenceDuration: number;
  timeAfterKillVideo: number;
  batchSize: number;
  coordinates_kills: CoordinatesKillsType;
};

export const config: ConfigType = {
  videoPath: `src/videos/in/shorts`,
  outputPath: "src/videos/out/shorts",
  processingPath: "src/videos/processing/",
  filterPath: "src/videos/filters/template.psd",
  processingPattern: "processing_%04d.png",
  sequenceDuration: 15,
  timeAfterKillVideo: 3,
  batchSize: 10,
  coordinates_kills: {
    x: 1807,
    y: 315,
    width: 21,
    height: 35,
  },
};
