# 🎮 Fortnite Video Splitter 🎮

This project is a video processing pipeline implemented in TypeScript using various technologies like FFmpeg, Tesseract.js, and Sharp. It provides functionalities for video segmentation, text extraction from images, and dynamic overlay of GIFs.
The purpose of this project is to automatically generate short YouTube videos from longer Fortnite gameplay videos. For instance, I provide the program with a 20-minute video where I achieve 6 kills. In return, the program generates 6 videos, each lasting 15 seconds, suitable for YouTube. Additionally, the program allows the incorporation of GIFs into the videos.

This project is a personal endeavor and is currently a work in progress. If you would like more information or wish to contribute to future developments, please feel free to contact me.

## Project Structure

- **imageProcessing.ts:** Contains functions to process images, including cropping specific regions of interest, resizing, grayscale conversion, and text extraction using Tesseract.js.

- **textProcessing.ts:** Provides functions to process text data extracted from images. It includes methods for cleaning and transforming text data, as well as identifying specific patterns within the text data to detect eliminations in a game context.

- **videoProcessing.ts:** Handles video-related tasks, such as splitting videos into frames, applying filters, and exporting short videos. It utilizes FFmpeg for video manipulation.

- **filterProcessing.ts:** Contains functions for applying filters to videos. It handles overlaying GIFs onto video segments.

## Installation

To get started with this project, follow these steps:

**Clone the repository:**

```shell
git clone git@github.com:jack75015/fortnite-app.git
cd fortnite-app
```

**Install Node.js and npm:**

Ensure you have Node.js and npm installed. If not, you can download and install them from the official Node.js website.

**Install Dependencies:**

```shell
npm install
```

**Build the TypeScript Code:**

```shell
npx tsc
```

**Start the Server:**

```shell
npm run start
```

## Config

**_videoPath_**

This property specifies the path where the input videos are located. In this case, input videos are expected to be in the src/videos/in/shorts directory.

**_outputPath_**

This property defines the directory where the generated output videos will be saved. After processing, the resulting short videos will be stored in the src/videos/out/shorts/ directory.

**_processingPath_**

This property indicates the directory where intermediate processing files are stored. During the video processing, temporary files are generated and manipulated in this directory. The processed images and videos will be stored here temporarily.

**_filterPath_**

This property specifies the directory where filter files (like GIFs) used in the videos are stored. Filters are additional elements added to the videos, and this path points to the location of those elements.

**_processingPattern_**

This property defines the naming pattern for the intermediate processing files. The %04d part of the pattern is a placeholder for a sequence number, ensuring unique names for each processed file.
