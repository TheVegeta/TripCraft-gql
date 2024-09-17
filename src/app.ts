import cors from "cors";
import express from "express";
import fs from "fs-extra";
import { UPLOAD_DIR } from "./constant";
import { AppDataSource } from "./data-source";
import { PORT } from "./env";
import { gqlRoute } from "./routes/gql";

(async () => {
  await Promise.all([AppDataSource.initialize(), fs.ensureDir(UPLOAD_DIR)]);

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(gqlRoute);

  app.listen(PORT, () => {
    console.log(`🚀 Server is up and running on port ${PORT}`);
  });
})();
