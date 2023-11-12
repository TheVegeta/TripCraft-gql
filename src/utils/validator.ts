import { z } from "zod";

export const personJwtValidator = z.object({
  _id: z.string(),
  email: z.string(),
  authType: z.string(),
  name: z.string(),
  picture: z.string(),
  iat: z.number(),
  exp: z.number(),
});
