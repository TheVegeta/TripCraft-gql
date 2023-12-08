import axios from "axios";
import { StatusCodes } from "http-status-codes";
import { Request, Response, Server } from "hyper-express";
import _ from "lodash";
import { AuthType, User } from "../../entity/User";
import { signJwt } from "../../helpers";
import { IGoogleAuthResponse, IJwtAuthResponse } from "../../types";
import { googleSignInJwtTime } from "../../utils/constant";
import {
  GOOGLE_AUTH_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../../utils/env";

export const googleAuthHandler = (server: Server) => {
  server.get("/auth/google", async (req: Request, res: Response) => {
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_AUTH_REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(authUrl);
  });

  server.get("/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          redirect_uri: GOOGLE_AUTH_REDIRECT_URI,
          grant_type: "authorization_code",
          code: req.query.code,
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const profileResponse = await axios.get<IGoogleAuthResponse>(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userProfile = profileResponse.data;

      const findUser = await User.findOne({
        where: { email: userProfile.email, authType: AuthType.GOOGLE },
      });

      if (findUser) {
        const jwtToken = signJwt<IJwtAuthResponse>(
          {
            _id: findUser._id,
            email: findUser.email,
            authType: findUser.authType,
            name: findUser.name,
            picture: findUser.picture,
          },
          { expiresIn: googleSignInJwtTime }
        );
        res.redirect(`/auth/google/app?authJwt=${jwtToken}&success=true`);
      } else {
        const newUser = new User();
        newUser.authType = AuthType.GOOGLE;
        newUser.email = _.toLower(userProfile.email);
        newUser.name = _.toLower(userProfile.name);
        newUser.picture = userProfile.picture;

        await newUser.save();

        const jwtToken = signJwt<IJwtAuthResponse>(
          {
            _id: newUser._id,
            email: newUser.email,
            authType: newUser.authType,
            name: newUser.name,
            picture: userProfile.picture,
          },
          { expiresIn: googleSignInJwtTime }
        );
        res.redirect(`/auth/google/app?authJwt=${jwtToken}&success=true`);
      }
    } catch (error) {
      const jwtToken = "";
      res.statusCode = StatusCodes.UNAUTHORIZED;
      res.redirect(`/auth/google/app?authJwt=${jwtToken}&success=false`);
    }
  });

  server.get("/auth/google/app", async (req: Request, res: Response) => {
    try {
      if (req.query.success === "true") {
        res.end(
          "Success! Your authentication is complete. We're redirecting you to the app for an awesome experience."
        );
      } else {
        res.statusCode = StatusCodes.UNAUTHORIZED;
        res.end(
          "Authentication unsuccessful. It seems there's an issue with your credentials. Verify and attempt authentication again."
        );
      }
    } catch (err) {
      res.statusCode = StatusCodes.UNAUTHORIZED;
      res.end(
        "Authentication unsuccessful. It seems there's an issue with your credentials. Verify and attempt authentication again."
      );
    }
  });
};
