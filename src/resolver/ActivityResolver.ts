import moment from "moment";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Activity, ICreateActivity } from "../entities/Activity";
import { isAuth } from "../middleware";
import { IGetById, IStatusResponse, MyContext } from "../types";

@Resolver()
export class ActivityResolver {
  @Query(() => [Activity])
  @UseMiddleware([isAuth])
  async getAllActivities(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<Activity[]> {
    return await Activity.find({
      where: { createdBy: { _id: user._id }, itinerary: { _id: options.id } },
    });
  }

  @Query(() => Activity)
  async getActivityById(@Arg("options") options: IGetById): Promise<Activity> {
    return await Activity.findOneOrFail({
      where: { _id: options.id },
    });
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isAuth])
  async createOrUpdateActivity(
    @Arg("options") options: ICreateActivity,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const {
        _id,
        name,
        placeName,
        latitude,
        longitude,
        startDate,
        endDate,
        startTime,
        endTime,
        remark,
      } = options;

      let record: Activity;

      if (_id) {
        record = await Activity.findOneOrFail({ where: { _id } });
        record.updatedBy = user;
      } else {
        record = new Activity();
        record.createdBy = user;
      }

      record.name = name;
      record.placeName = placeName;
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
  async deleteActivity(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const record = await Activity.findOneOrFail({
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
