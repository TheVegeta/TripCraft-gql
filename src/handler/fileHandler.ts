import fsType from "file-type";
import { StatusCodes } from "http-status-codes";
import HyperExpress, { Request, Response } from "hyper-express";
import { nanoid } from "nanoid";
import { uploadPath } from "../constant";

const fileHandler = new HyperExpress.Router();

fileHandler.post("/file", async (req: Request, res: Response) => {
  let save_path;

  const imgArr: Array<string> = [];

  try {
    await Promise.all([
      req.multipart(async (field) => {
        if (field.name === "file" && field.file) {
          const { fileType } = await fsType.stream(field.file.stream);
          const fileName = nanoid(8) + "." + fileType?.ext;

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

export { fileHandler };
