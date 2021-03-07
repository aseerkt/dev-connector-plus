import { validate } from 'class-validator';
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
} from 'type-graphql';
import argon2 from 'argon2';
import gravatar from 'gravatar';
import { User, UserModel } from '../entities/User';
import { FieldError } from '../types';
import { extractFieldErrors } from '../utils/extractFieldErrors';
import { MyContext } from '../MyContext';

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

export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }

  // REGISTER

  @Mutation(() => UserResponse)
  async register(
    @Args() { name, email, password }: RegisterArgs,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    try {
      const user = new UserModel({ name, email, password } as User);
      // Validate input data
      const validationErrors = await validate(user);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      user.avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      await user.save();
      // start session
      req.session.userId = user._id;
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
}
