import express from "express";
import * as dotenv from "dotenv";
import "dotenv/config";
import "reflect-metadata";
dotenv.config({ path: __dirname + "/.env" });
const app = express();

app.get("/", (req, res) => {
  console.log("Hello World!");
  res.json("Hello World!");
});

export default app;
