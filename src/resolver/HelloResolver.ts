import { Query, Resolver } from "type-graphql";
import { User } from "../entity/User";

@Resolver()
export class HelloResolver {
  // @UseMiddleware([isUserAuthenticated])
  @Query(() => [User])
  async hello(): Promise<User[]> {
    await new Promise((r) => setTimeout(r, 5000));

    return await User.find();
  }
}
