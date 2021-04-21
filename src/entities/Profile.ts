import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import {
  IsDate,
  IsUrl,
  IsNotEmpty,
  MinLength,
  ValidateNested,
  IsOptional,
} from 'class-validator';
// import { IsNotURL } from '../utils/IsNotURL';
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
  @IsDate({ message: 'From date has invalid date format' })
  @prop({ type: () => Date, required: true })
  from: Date;

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, default: undefined })
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
  @IsDate({ message: 'From date has invalid date format' })
  @prop({ type: () => Date, required: true })
  from: Date;

  @Field(() => Date, { nullable: true })
  @prop({ type: Date, default: undefined })
  to?: Date;

  @Field()
  @prop({ default: false })
  current: boolean;

  @Field({ nullable: true })
  @prop()
  description?: string;
}

// Social

@ObjectType()
export class Social {
  constructor(social: Partial<Social>) {
    // super();
    Object.assign(this, social);
  }

  @Field({ nullable: true })
  @prop()
  @IsOptional()
  @IsUrl(undefined, { message: 'Please provide valid URL' })
  youtube?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl(undefined, { message: 'Please provide valid URL' })
  @prop()
  twitter?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl(undefined, { message: 'Please provide valid URL' })
  @prop()
  facebook?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl(undefined, { message: 'Please provide valid URL' })
  @prop()
  linkedin?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl(undefined, { message: 'Please provide valid URL' })
  @prop()
  instagram?: string;
}

@ObjectType()
export class Profile extends Default {
  constructor(profile: Partial<Profile>) {
    super();
    Object.assign(this, profile);
  }
  @Field(() => User)
  @prop({ ref: User, required: true, unique: true })
  user: Ref<User>;

  @Field({ nullable: true })
  @prop()
  company?: string;

  @Field({ nullable: true })
  @prop()
  @IsUrl(undefined, { message: 'Invalid website URL' })
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

  @Field()
  @IsNotEmpty({ message: 'Skill is required' })
  @prop({ required: true })
  skills: string;

  @Field(() => [Experience])
  // @ValidateNested({ each: true })
  @prop({ type: () => [Experience] })
  experiences: Experience[];

  @Field(() => [Education])
  // @ValidateNested({ each: true })
  @prop({ type: () => [Education] })
  educations: Education[];

  @Field(() => Social)
  @prop({ type: () => Social })
  @ValidateNested()
  social: Social;
}

export const ProfileModel = getModelForClass(Profile, {
  schemaOptions: { timestamps: true },
});
