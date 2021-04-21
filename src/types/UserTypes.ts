import { ArgsType, Field, ObjectType } from 'type-graphql';
import { User } from '../entities/User';
import { FieldError } from '../types';

@ArgsType()
export class RegisterArgs {
  @Field()
  name: string;
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => Boolean, { nullable: true })
  ok?: boolean;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@ObjectType()
export class LoginResponse {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => String, { nullable: true })
  jwt?: string;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
