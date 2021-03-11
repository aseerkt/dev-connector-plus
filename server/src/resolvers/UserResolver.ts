import { isEmail, validate } from 'class-validator';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import argon2 from 'argon2';
import gravatar from 'gravatar';
import { User, UserModel } from '../entities/User';
import { FieldError } from '../types';
import { extractFieldErrors } from '../utils/extractFieldErrors';
import { MyContext } from '../MyContext';
import { COOKIE_NAME } from '../constants';

@ArgsType()
class RegisterArgs {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId == user._id) {
      return user.email;
    }
    return '';
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    return UserModel.findById(req.session.userId);
  }

  // REGISTER

  @Mutation(() => UserResponse)
  async register(
    @Args() { name, email, password }: RegisterArgs
  ): // @Ctx() { req }: MyContext
  Promise<UserResponse> {
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
      // req.session.userId = user._id;
      return { user };
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
  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
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
    req.session.userId = user._id;
    return { user };
  }

  // LOGOUT
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) => {
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        res.clearCookie(COOKIE_NAME);
        resolve(true);
        return;
      });
    });
  }
}
