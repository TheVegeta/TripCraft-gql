import "dotenv/config";
import "reflect-metadata";

import fs from "fs-extra";
import { map } from "modern-async";
import path from "path";
import { __CWD, ensureDir } from "./utils/constant";

(async () => {
  await map(ensureDir, async (item: string) => {
    await fs.ensureDir(path.resolve(__CWD + "/" + item));
  });
})();
