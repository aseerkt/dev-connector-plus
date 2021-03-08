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
} from '../entities/Profile';
import { User, UserModel } from '../entities/User';
import { MyContext } from '../MyContext';
import { ObjectId } from 'mongodb';
import { validate } from 'class-validator';
import { extractFieldErrors } from '../utils/extractFieldErrors';
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
  async myProfile(@Ctx() { req }: MyContext): Promise<Profile | null> {
    return ProfileModel.findOne({ user: req.session.userId! });
  }

  @Query(() => [Profile])
  getAllProfiles() {
    return ProfileModel.find();
  }

  @Query(() => Profile, { nullable: true })
  getProfileByUserId(@Arg('userId', () => ID) userId: ObjectId) {
    return ProfileModel.findOne({ user: userId });
  }

  // ADD PROFILE =======================================================================

  @Mutation(() => ProfileResponse)
  @UseMiddleware(isAuth)
  async createProfile(
    @Arg('profileInput', () => ProfileInputType) profileInput: ProfileInputType,
    @Ctx() { req }: MyContext
  ): Promise<ProfileResponse> {
    try {
      const skills = profileInput.skills.split(',').map((s) => s.trim());
      const profile = new ProfileModel({
        ...profileInput,
        skills,
        user: req.session.userId,
      } as Profile);
      const validationErrors = await validate(profile);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      await profile.save();
      // profile;
      // console.log(profile);
      return { profile };
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
    @Ctx() { req }: MyContext
  ): Promise<ProfileResponse> {
    try {
      const profile = await ProfileModel.findOne({ user: req.session.userId! });
      if (!profile) {
        return {
          errors: [
            { path: 'userId', message: 'Profile not found for current user' },
          ],
        };
      }
      const {
        website,
        location,
        status,
        bio,
        skills,
        company,
        githubusername,
        social,
      } = profileInput;

      if (website) profile.website = website;
      if (location) profile.location = location;
      if (status) profile.status = status;
      if (bio) profile.bio = bio;
      if (company) profile.company = company;
      if (githubusername) profile.githubusername = githubusername;
      if (skills) profile.skills = skills.split(',').map((s) => s.trim());
      if (social) {
        if (social.youtube) profile.social.youtube = social.youtube;
        if (social.facebook) profile.social.facebook = social.facebook;
        if (social.instagram) profile.social.instagram = social.instagram;
        if (social.twitter) profile.social.twitter = social.twitter;
        if (social.linkedin) profile.social.linkedin = social.linkedin;
      }
      const validationErrors = await validate(profile);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      await profile.save();
      return { profile };
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
  async deleteUser(@Ctx() { req, res }: MyContext) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await ProfileModel.findOneAndDelete(
        { user: req.session.userId! },
        { session }
      );
      // TODO: delete all posts of the user
      await UserModel.findByIdAndDelete(req.session.userId, { session });
      session.commitTransaction();
      session.endSession();
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return false;
        }
        res.clearCookie(COOKIE_NAME);
        return true;
      });
    } catch (err) {
      console.log(err);
      session.abortTransaction();
      session.endSession();
    }
    return false;
  }

  // ADD EXPERIENCE ==================================================================

  @Mutation(() => ExpResponse)
  @UseMiddleware(isAuth)
  async addExperience(
    @Ctx() { req }: MyContext,
    @Arg('expInput', () => ExpInput) expInput: ExpInput
  ): Promise<ExpResponse> {
    try {
      const profile = await ProfileModel.findOne({ user: req.session.userId! });
      if (!profile)
        return { errors: [{ path: 'profile', message: 'Profile not found' }] };
      const newExp = new Experience(expInput);
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
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const profile = await ProfileModel.findOne({ user: req.session.userId! });
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
    @Ctx() { req }: MyContext,
    @Arg('eduInput', () => EduInput) eduInput: EduInput
  ): Promise<EduResponse> {
    try {
      const profile = await ProfileModel.findOne({ user: req.session.userId! });
      if (!profile)
        return { errors: [{ path: 'profile', message: 'Profile not found' }] };
      const newEdu = new Education(eduInput);
      const validationErrors = await validate(newEdu);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      profile.eductions.push(newEdu);
      await profile.save();
      return {
        education: profile.eductions[profile.eductions.length - 1],
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
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const profile = await ProfileModel.findOne({ user: req.session.userId! });
      if (!profile) throw new Error('Profile not found');
      profile.eductions = profile.eductions.filter((edu) => edu._id != eduId);
      await profile.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
