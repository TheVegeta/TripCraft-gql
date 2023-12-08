import { StatusCodes } from "http-status-codes";
import { Request, Response, Server } from "hyper-express";
import { nanoid } from "nanoid";
import { LiveAssets, uploadPath } from "../helpers";

export const assetsAuthHandler = (server: Server) => {
  server.get("/assets/*", async (req: Request, res: Response) => {
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

  server.post("/assets", async (req: Request, res: Response) => {
    let save_path;

    const imgArr: Array<string> = [];

    try {
      await Promise.all([
        req.multipart(async (field) => {
          if (field.name === "file" && field.file) {
            const fileName =
              nanoid(8) + "." + field.file.name?.split(".").pop();

            save_path = uploadPath + "/" + fileName;

            imgArr.push(fileName);

            field.write(save_path);
          }
        }),
      ]);
    } catch (error) {
      //  @ts-ignore
      if (typeof error === "FILES_LIMIT_REACHED") {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          msg: "You have sent too many files. Please try again.",
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          msg: "Internal Server Error.",
        });
      }
    }

    if (save_path) {
      return res.json({ success: true, imageArray: imgArr });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        msg: "Bad Request.",
      });
    }
  });
};
