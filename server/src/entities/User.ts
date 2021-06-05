import { getModelForClass, prop, pre } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';
import { Default } from './Default';
import argon2 from 'argon2';
import { IsEmail, MinLength } from 'class-validator';

// Schema hooks
@pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
})
// Schema
@ObjectType()
export class User extends Default {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Field()
  @MinLength(1, { message: 'Name is required' })
  @MinLength(3, {
    message: 'Name must be at least $constraint1 characters long',
  })
  @prop({ required: true })
  name: string;

  @Field()
  @MinLength(1, { message: 'Email is required' })
  @IsEmail(undefined, { message: 'Email is invalid' })
  @prop({ unique: true, required: true })
  email: string;

  @MinLength(1, {
    message: 'Password is required',
  })
  @MinLength(6, {
    message: 'Password must be minimum $constraint1 characters long',
  })
  @prop({
    required: true,
  })
  password: string;

  @Field({ nullable: true })
  @prop()
  avatar: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
