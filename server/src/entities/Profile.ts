import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import {
  ArrayNotEmpty,
  IsDate,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { Default, IdOnly } from './Default';
import { User } from './User';

@ObjectType()
export class Experience extends IdOnly {
  constructor(experience: Partial<Experience>) {
    super();
    Object.assign(this, experience);
  }

  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  @prop({ required: true })
  title: string;

  @Field()
  @IsNotEmpty({ message: 'Company is required' })
  @prop({ required: true })
  company: string;

  @Field({ nullable: true })
  @prop()
  location: string;

  @Field(() => Date)
  @IsNotEmpty({ message: 'From date is required' })
  @IsDate({ message: 'From date is invalid date format' })
  @prop({ type: () => Date, required: true })
  from: Date;

  @Field(() => Date, { nullable: true })
  @prop({ type: () => Date })
  to: Date;

  @Field()
  @prop({ default: false })
  current: boolean;

  @Field({ nullable: true })
  @prop()
  description: string;
}

@ObjectType()
export class Education extends IdOnly {
  constructor(education: Partial<Education>) {
    super();
    Object.assign(this, education);
  }

  @Field()
  @IsNotEmpty({ message: 'School is required' })
  @prop({ required: true })
  school: string;

  @Field()
  @IsNotEmpty({ message: 'Degree is required' })
  @prop({ required: true })
  degree: string;

  @Field()
  @IsNotEmpty({ message: 'Field of Study is required' })
  @prop({ required: true })
  fieldofstudy: string;

  @Field(() => Date)
  @IsNotEmpty({ message: 'From date is required' })
  @prop({ type: () => Date, required: true })
  from: Date;

  @Field(() => Date, { nullable: true })
  @prop({ type: () => Date })
  to?: Date;

  @Field()
  @prop({ default: false })
  current: boolean;

  @Field({ nullable: true })
  @prop()
  description?: string;
}

@ObjectType()
export class Social {
  @Field({ nullable: true })
  youtube?: string;

  @Field({ nullable: true })
  twitter?: string;

  @Field({ nullable: true })
  facebook?: string;

  @Field({ nullable: true })
  linkedin?: string;

  @Field({ nullable: true })
  instagram?: string;
}

@ObjectType()
export class Profile extends Default {
  @Field(() => User)
  @prop({ ref: User, required: true, unique: true })
  user: Ref<User>;

  @Field({ nullable: true })
  @prop()
  company?: string;

  @Field({ nullable: true })
  @prop()
  website?: string;

  @Field({ nullable: true })
  @prop()
  location?: string;

  @Field()
  @MinLength(1, { message: 'Status is required' })
  @prop({ required: true })
  status: string;

  @Field({ nullable: true })
  @prop()
  bio?: string;

  @Field({ nullable: true })
  @prop()
  githubusername?: string;

  @Field(() => [String])
  @ArrayNotEmpty({ message: 'Skills are required' })
  @prop({ type: () => [String], required: true })
  skills: string[];

  @Field(() => [Experience])
  @ValidateNested({ each: true })
  @prop({ type: () => [Experience] })
  experiences: Experience[];

  @Field(() => [Education])
  @ValidateNested({ each: true })
  @prop({ type: () => [Education] })
  eductions: Education[];

  @Field(() => Social)
  @prop({ type: () => Social })
  social: Social;
}

export const ProfileModel = getModelForClass(Profile, {
  schemaOptions: { timestamps: true },
});
