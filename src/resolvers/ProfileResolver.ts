import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import mongoose from 'mongoose';
import {
  Education,
  Experience,
  Profile,
  ProfileModel,
  Social,
} from '../entities/Profile';
import { User, UserModel } from '../entities/User';
import { MyContext } from '../MyContext';
import { ObjectId } from 'mongodb';
import { validate } from 'class-validator';
import { extractFieldErrors } from '../utils/extractFieldErrors';
import { cleanObj } from '../utils/cleanObj';
import { isAuth } from '../middlewares/isAuth';
import {
  ProfileInputType,
  ProfileResponse,
  ExpInput,
  ExpResponse,
  EduResponse,
  EduInput,
} from '../types/ProfileTypes';
import { COOKIE_NAME } from '../constants';

@Resolver(Profile)
export class ProfileResolver {
  @FieldResolver(() => User)
  user(
    @Root() profile: Profile,
    @Ctx() { userLoader }: MyContext
  ): Promise<User> {
    return userLoader.load(profile.user as ObjectId);
  }

  // QUERY PROFILE ======================================================================

  @Query(() => Profile, { nullable: true })
  @UseMiddleware(isAuth)
  async myProfile(@Ctx() { res }: MyContext): Promise<Profile | null> {
    return ProfileModel.findOne({ user: res.locals.userId! }).populate(
      'educations experiences'
    );
  }

  @Query(() => [Profile])
  getAllProfiles() {
    return ProfileModel.find().populate('educations experiences');
  }

  @Query(() => Profile, { nullable: true })
  getProfileByUserId(@Arg('userId', () => ID) userId: ObjectId) {
    return ProfileModel.findOne({ user: userId }).populate(
      'educations experiences'
    );
  }

  // ADD PROFILE =======================================================================

  @Mutation(() => ProfileResponse)
  @UseMiddleware(isAuth)
  async createProfile(
    @Arg('profileInput', () => ProfileInputType) profileInput: ProfileInputType,
    @Ctx() { res }: MyContext
  ): Promise<ProfileResponse> {
    try {
      const social = profileInput.social
        ? new Social(cleanObj(profileInput.social))
        : undefined;
      const profile = new Profile({
        ...profileInput,
        social,
        user: res.locals.userId!,
      });
      const validationErrors = await validate(profile);
      if (validationErrors.length > 0) {
        const errors = extractFieldErrors(validationErrors);
        return {
          errors,
        };
      }
      const newProfile = new ProfileModel(profile);
      await newProfile.save();
      // profile;
      // console.log(profile);
      return { profile: newProfile };
    } catch (err) {
      console.log(err);
      return {
        errors: [{ path: 'unknown', message: 'Unable to add profile' }],
      };
    }
  }

  // UPDATE PROFILE ============================================================

  @Mutation(() => ProfileResponse)
  @UseMiddleware(isAuth)
  async updateProfile(
    @Arg('profileInput', () => ProfileInputType) profileInput: ProfileInputType,
    @Ctx() { res }: MyContext
  ): Promise<ProfileResponse> {
    try {
      const social = profileInput.social
        ? new Social(cleanObj(profileInput.social))
        : undefined;
      console.log(social);
      const profile = new Profile({ ...profileInput, social });
      const validationErrors = await validate(profile);
      if (validationErrors.length > 0) {
        console.log(validationErrors);
        return { errors: extractFieldErrors(validationErrors) };
      }
      const newProfile = await ProfileModel.findOneAndUpdate(
        {
          user: res.locals.userId!,
        },
        {
          $set: {
            ...profile,
            social: profile.social,
            user: res.locals.userId!,
          },
        }
      );
      return { profile: newProfile ? newProfile : undefined };
    } catch (err) {
      console.log(err);
      return {
        errors: [{ path: 'unknown', message: 'Unable to update profile' }],
      };
    }
  }

  // DELETE PROFLE, USER & POSTS ===================================================

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(@Ctx() { res }: MyContext) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await ProfileModel.findOneAndDelete(
        { user: res.locals.userId! },
        { session }
      );
      // TODO: delete all posts of the user
      await UserModel.findByIdAndDelete(res.locals.userId, { session });
      await session.commitTransaction();
      session.endSession();
      res.clearCookie(COOKIE_NAME);
      return true;
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      session.endSession();
    }
    return false;
  }

  // ADD EXPERIENCE ==================================================================

  @Mutation(() => ExpResponse)
  @UseMiddleware(isAuth)
  async addExperience(
    @Ctx() { res }: MyContext,
    @Arg('expInput', () => ExpInput) expInput: ExpInput
  ): Promise<ExpResponse> {
    try {
      const profile = await ProfileModel.findOne({ user: res.locals.userId! });
      if (!profile)
        return { errors: [{ path: 'profile', message: 'Profile not found' }] };
      // console.log(expInput);
      // console.log(expInput.from.toString());
      const newExp = new Experience(cleanObj(expInput));
      const validationErrors = await validate(newExp);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      profile.experiences.push(newExp);
      await profile.save();
      return {
        experience: profile.experiences[profile.experiences.length - 1],
      };
    } catch (err) {
      console.log(err);
      return {
        errors: [{ path: 'unknown', message: 'Unable to update profile' }],
      };
    }
  }

  // DELETE EXPERIENCE ===============================================================

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteExp(
    @Arg('expId', () => ID) expId: ObjectId,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    try {
      const profile = await ProfileModel.findOne({ user: res.locals.userId! });
      if (!profile) throw new Error('Profile not found');
      profile.experiences = profile.experiences.filter(
        (exp) => exp._id != expId
      );
      await profile.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // ADD EDUCATION ==================================================================

  @Mutation(() => EduResponse)
  @UseMiddleware(isAuth)
  async addEducation(
    @Ctx() { res }: MyContext,
    @Arg('eduInput', () => EduInput) eduInput: EduInput
  ): Promise<EduResponse> {
    try {
      const profile = await ProfileModel.findOne({ user: res.locals.userId! });
      if (!profile)
        return { errors: [{ path: 'profile', message: 'Profile not found' }] };

      const newEdu = new Education(cleanObj(eduInput));
      const validationErrors = await validate(newEdu);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      profile.educations.push(newEdu);
      await profile.save();
      return {
        education: profile.educations[profile.educations.length - 1],
      };
    } catch (err) {
      console.log(err);
      return {
        errors: [{ path: 'unknown', message: 'Unable to update profile' }],
      };
    }
  }

  // DELETE EDUCATION===============================================================

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteEdu(
    @Arg('eduId', () => ID) eduId: ObjectId,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    try {
      const profile = await ProfileModel.findOne({ user: res.locals.userId! });
      if (!profile) throw new Error('Profile not found');
      profile.educations = profile.educations.filter((edu) => edu._id != eduId);
      await profile.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
