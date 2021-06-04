import { unlinkSync, existsSync } from 'fs';
import { isEmail, validate } from 'class-validator';
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import argon2 from 'argon2';
import gravatar from 'gravatar';
import { User, UserModel } from '../entities/User';
import { extractFieldErrors } from '../utils/extractFieldErrors';
import { MyContext } from '../MyContext';
import { COOKIE_NAME, GRAVATAR_PREFIX } from '../constants';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AuthenticationError } from 'apollo-server-express';
import { uploadFile } from '../utils/uploadFile';
import { isAuth } from '../middlewares/isAuth';
import { isUser } from '../middlewares/isUser';
import { authenticateUser } from '../utils/authenticateUser';
import {
  LoginResponse,
  RegisterArgs,
  RegisterResponse,
} from '../types/UserTypes';
import { setTokenToCookie } from '../utils/tokenHandler';

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  @UseMiddleware(isUser)
  email(@Root() user: User, @Ctx() { res }: MyContext) {
    if (res.locals.userId == user._id) {
      console.log('made it here');
      return user.email;
    }
    return '';
  }

  @FieldResolver(() => String)
  avatar(@Root() user: User) {
    if (user.avatar.startsWith(GRAVATAR_PREFIX)) return `https:${user.avatar}`;
    return `${process.env.APP_URL}/${user.avatar}`;
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isUser)
  me(@Ctx() { res }: MyContext) {
    return UserModel.findById(res.locals.userId);
  }

  // REGISTER

  @Mutation(() => RegisterResponse)
  async register(
    @Args() { name, email, password }: RegisterArgs
  ): Promise<RegisterResponse> {
    try {
      const userObj = new User({ name, email, password });
      // Validate input data
      const validationErrors = await validate(userObj);
      console.log(validationErrors);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      const user = new UserModel(userObj);
      user.avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      await user.save();
      // start session
      // res.locals.userId = user._id;
      return { ok: true };
    } catch (err) {
      console.log(err);
      if (err.name === 'MongoError' && err.code === 11000) {
        return {
          errors: [{ path: 'email', message: 'Email is already taken' }],
        };
      }
      return {
        errors: [{ path: 'unknown', message: 'Unable to register user' }],
      };
    }
  }

  // LOGIN
  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await UserModel.findOne({ email });
    // let fieldErrors: FieldError[] = [];

    if (!isEmail(email))
      return { errors: [{ path: 'email', message: 'Invalid Email Address' }] };

    // if (fieldErrors.length > 0) {
    //   return { errors: fieldErrors };
    // }
    if (!user) {
      return { errors: [{ path: 'email', message: 'User not found' }] };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return { errors: [{ path: 'password', message: 'Incorrect password' }] };
    }
    setTokenToCookie(res, user);
    res.locals.userId = user._id;
    return { user };
  }

  @Mutation(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async updateAvatar(
    @Arg('file', () => GraphQLUpload) file: FileUpload,
    @Ctx() ctx: MyContext
  ) {
    await authenticateUser(ctx);
    const user = await UserModel.findById(ctx.res.locals.userId);
    if (!user) throw new AuthenticationError('Not Authenticated');
    const { isUploaded, Urn } = await uploadFile(file);
    if (isUploaded && Urn && user.avatar) {
      if (!user.avatar.startsWith(GRAVATAR_PREFIX)) {
        if (existsSync('public/' + user.avatar))
          unlinkSync('public/' + user.avatar);
      }
      user.avatar = Urn;
      await user.save();
      return `${process.env.APP_URL}/${user.avatar}`;
    }
    return null;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): Promise<boolean> {
    return new Promise((resolve) => {
      res.clearCookie(COOKIE_NAME);
      res.locals.userId = null;
      resolve(true);
    });
  }
}
