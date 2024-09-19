import moment from "moment";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ICreatePlaces, Places } from "../entities/Places";
import { isAuth } from "../middleware";
import { IGetById, IStatusResponse, MyContext } from "../types";

@Resolver()
export class PlacesResolver {
  @Query(() => [Places])
  @UseMiddleware([isAuth])
  async getAllPlaces(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<Places[]> {
    return await Places.find({
      where: { createdBy: { _id: user._id }, itinerary: { _id: options.id } },
    });
  }

  @Query(() => Places)
  async getPlaceById(@Arg("options") options: IGetById): Promise<Places> {
    return await Places.findOneOrFail({
      where: { _id: options.id },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isAuth])
  async createOrUpdatePlace(
    @Arg("options") options: ICreatePlaces,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const {
        _id,
        name,
        latitude,
        longitude,
        startDate,
        endDate,
        startTime,
        endTime,
        remark,
      } = options;

      let record: Places;

      if (_id) {
        record = await Places.findOneOrFail({ where: { _id } });
        record.updatedBy = user;
      } else {
        record = new Places();
        record.createdBy = user;
      }

      record.name = name;
      record.latitude = latitude;
      record.longitude = longitude;
      record.startDate = moment(startDate).toDate();
      record.endDate = moment(endDate).toDate();
      record.startTime = moment(startTime).toDate();
      record.endTime = moment(endTime).toDate();
      record.remark = remark;

      await record.save();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isAuth])
  async deletePlace(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const record = await Places.findOneOrFail({
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
