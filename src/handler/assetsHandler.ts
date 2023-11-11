import { StatusCodes } from "http-status-codes";
import HyperExpress, { Request, Response } from "hyper-express";
import { LiveAssets } from "../utils";

const assetsHandler = new HyperExpress.Router();

assetsHandler.get("/assets/*", (req: Request, res: Response) => {
  const path = req.path.replace("/assets", "");
  const file = LiveAssets.get(path);

  if (file === undefined)
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(
        "The assets you are attempting to access do not exist on the server."
      );

  if (file.cached) res.send(file.content);

  file.stream().pipe(res);
});

export { assetsHandler };
