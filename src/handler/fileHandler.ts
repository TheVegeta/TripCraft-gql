import upload from "express-fileupload";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { Polka, Request, Response } from "polka";
import { uploadPath } from "../constant";
import { ICustomResponse } from "../types";
import { LiveAssets, megabytesToBytes, sendJson } from "../utils";

export const bootstrapFileHandler = (app: Polka<Request>) => {
  app.get("/assets/*", (req: Request, res: Response) => {
    const path = req.path.replace("/assets", "");
    const file = LiveAssets.get(path);

    if (file === undefined) {
      res.statusCode = StatusCodes.NOT_FOUND;
      res.end(
        "The assets you are attempting to access do not exist on the server."
      );
    } else {
      if (file.cached) res.end(file.content);

      file.stream().pipe(res);
    }
  });

  app
    // @ts-ignore
    .use(upload())
    // @ts-ignore
    .post("/file", async (req: ICustomResponse, res: Response) => {
      if (req.files.file) {
        if (megabytesToBytes(2) >= req.files.file.size) {
          const fileExtension = path.extname(req.files.file.name);

          req.files.file.mv(
            uploadPath + "/" + req.files.file.md5 + fileExtension,
            (err) => {
              if (err) {
                res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
                sendJson(res, {
                  success: false,
                  msg: "File uploading error on the server",
                  data: "",
                });
              } else {
                sendJson(res, {
                  success: true,
                  msg: "The file was uploaded successfully to the server.",
                  data: req.files.file.md5 + fileExtension,
                });
              }
            }
          );
        } else {
          sendJson(res, {
            success: false,
            msg: "The file size limit has been exceeded.",
            data: "",
          });
        }
      } else {
        res.statusCode = StatusCodes.BAD_REQUEST;
        sendJson(res, {
          success: false,
          msg: "Please upload a valid file.",
          data: "",
        });
      }
    });
};
