export type CoordinatesKillsType = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FilterType = {
  filterPath: string;
  timeStart?: number;
  timeEnd?: number;
  positionWidth: number;
  positionHeight: number;
};

export type ConfigType = {
  videoPath: string;
  outputPath: string;
  processingPath: string;
  processingPattern: string;
  sequenceDuration: number;
  timeAfterKillVideo: number;
  batchSize: number;
  coordinates_kills: CoordinatesKillsType;
  shortFormatHeight: number;
  shortFormatWidth: number;
  filterConfigs: FilterType[];
};

export const config: ConfigType = {
  videoPath: `src/videos/in/shorts`,
  outputPath: "src/videos/out/shorts/",
  processingPath: "src/videos/processing/",
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
  shortFormatHeight: 1920,
  shortFormatWidth: 1080,
  filterConfigs: [
    {
      filterPath: `src/videos/filters/like.gif`,
      positionWidth: 50,
      positionHeight: 310,
    },
    {
      filterPath: `src/videos/filters/name.psd`,
      positionWidth: 10,
      positionHeight: 10,
    },
    {
      filterPath: `src/videos/filters/subscribe.gif`,
      timeStart: 0,
      timeEnd: 4,
      positionWidth: 640,
      positionHeight: 40,
    },
  ],
};
