import moment from "moment";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ICreateItinerary, Itinerary } from "../entities/Itinerary";
import { isAuth } from "../middleware";
import { IGetById, IStatusResponse, MyContext } from "../types";

@Resolver()
export class ItineraryResolver {
  @Query(() => [Itinerary])
  @UseMiddleware([isAuth])
  async getAllItinerary(@Ctx() { user }: MyContext): Promise<Itinerary[]> {
    return await Itinerary.find({ where: { createdBy: { _id: user._id } } });
  }

  @Query(() => Itinerary)
  @UseMiddleware([isAuth])
  async getItineraryById(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<Itinerary> {
    return await Itinerary.findOneOrFail({
      where: { createdBy: { _id: user._id }, _id: options.id },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isAuth])
  async createOrUpdateItinerary(
    @Arg("options") options: ICreateItinerary,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { _id, endDate, latitude, longitude, name, placeName, startDate } =
        options;

      let record: Itinerary;

      if (_id) {
        record = await Itinerary.findOneOrFail({ where: { _id } });
        record.updatedBy = user;
      } else {
        record = new Itinerary();
      }

      record.name = name;
      record.placeName = placeName;
      record.latitude = latitude;
      record.longitude = longitude;
      record.endDate = moment(endDate).toDate();
      record.startDate = moment(startDate).toDate();
      record.createdBy = user;

      await record.save();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isAuth])
  async deleteItinerary(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const record = await Itinerary.findOneOrFail({
        where: { _id: options.id },
      });

      record.updatedBy = user;

      await record.save();
      await record.softRemove();

      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
