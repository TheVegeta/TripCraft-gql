import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { jwtSignInTime } from "../constant";
import { User } from "../entity/User";
import { IJwtAuthResponse } from "../types";
import { decodeJwt, signJwt } from "../utils";
import { personJwtValidator } from "../utils/validator";

@InputType()
export class IGoogleAuthInput {
  @Field()
  jwt!: string;
}

@ObjectType({ simpleResolvers: true })
export class IGoogleAuthResponse {
  @Field()
  success!: boolean;

  @Field()
  msg!: string;

  @Field()
  jwt!: string;

  @Field(() => User, { nullable: true })
  user!: User | null;
}

@Resolver()
export class AuthResolver {
  @Mutation(() => IGoogleAuthResponse)
  async authMobileUser(
    @Arg("options") options: IGoogleAuthInput
  ): Promise<IGoogleAuthResponse> {
    const { jwt } = options;

    try {
      const decodedJwt = decodeJwt<IJwtAuthResponse>(jwt);

      const { _id } = personJwtValidator.parse(decodedJwt);

      const findUser = await User.findOneOrFail({ where: { _id } });

      return {
        success: true,
        user: findUser,
        msg: "Successfully logged in.",
        jwt: signJwt<IJwtAuthResponse>(
          {
            _id: findUser._id,
            email: findUser.email,
            authType: findUser.authType,
            name: findUser.name,
            picture: findUser.picture,
          },
          { expiresIn: jwtSignInTime }
        ),
      };
    } catch (err) {
      return {
        success: false,
        user: null,
        msg: "Oops! Authentication failed.",
        jwt: "",
      };
    }
  }
}
