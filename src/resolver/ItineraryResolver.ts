import moment from "moment";
import { nanoid } from "nanoid";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ICreateItinerary, Itinerary } from "../entities/Itinerary";
import { Tripmate } from "../entities/Tripmate";
import { isAuth } from "../middleware";
import {
  IGetById,
  IItineraryToken,
  IStatusResponse,
  MyContext,
} from "../types";
import { decodeJwt, signJwt } from "../utils";

@Resolver()
export class ItineraryResolver {
  @Query(() => [Itinerary])
  @UseMiddleware([isAuth])
  async getAllItinerary(@Ctx() { user }: MyContext): Promise<Itinerary[]> {
    return await Itinerary.find({ where: { createdBy: { _id: user._id } } });
  }

  @Query(() => [Tripmate])
  @UseMiddleware([isAuth])
  async getAllJoinItinerary(@Ctx() { user }: MyContext): Promise<Tripmate[]> {
    return await Tripmate.find({
      where: { user: { _id: user._id }, isVerified: true },
      relations: { itinerary: true },
    });
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
        record.createdBy = user;
      }

      record.name = name;
      record.placeName = placeName;
      record.latitude = latitude;
      record.longitude = longitude;
      record.endDate = moment(endDate).toDate();
      record.startDate = moment(startDate).toDate();

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

  @Mutation(() => IItineraryToken)
  @UseMiddleware([isAuth])
  async inviteTripmate(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<IItineraryToken> {
    try {
      const isCreator = await Itinerary.findOne({
        where: { _id: options.id, createdBy: { _id: user._id } },
      });

      const isTripMate = await Tripmate.findOne({
        where: { itinerary: { _id: options.id }, isVerified: true },
      });

      const record = new Tripmate();
      record.code = nanoid(8) + nanoid(4);
      record.isVerified = false;
      record.itinerary = await Itinerary.findOneOrFail({
        where: { _id: options.id },
      });
      record.createdBy = user;

      await record.save();

      if (isCreator || isTripMate) {
        return { code: signJwt({ _id: record.code }, "14d") };
      } else {
        return { code: "" };
      }
    } catch (err) {
      return { code: "" };
    }
  }

  @Mutation(() => IStatusResponse)
  @UseMiddleware([isAuth])
  async joinTripmate(
    @Arg("options") options: IGetById,
    @Ctx() { user }: MyContext
  ): Promise<IStatusResponse> {
    try {
      const { success, _id } = decodeJwt(options.id);

      if (success === false) return { success: false };

      const record = await Tripmate.findOneOrFail({
        where: { code: _id, isVerified: false },
      });

      record.isVerified = true;
      record.user = user;
      record.updatedBy = user;

      await record.save();
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  }
}
