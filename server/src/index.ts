import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
  console.log("get home route");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
