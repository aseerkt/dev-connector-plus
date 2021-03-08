import { ObjectType, Field, InputType } from 'type-graphql';
import { Education, Experience, Profile } from '../entities/Profile';
import { FieldErrorArray } from '../types';

@ObjectType()
export class ProfileResponse extends FieldErrorArray {
  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}

@ObjectType()
export class ExpResponse extends FieldErrorArray {
  @Field(() => Experience, { nullable: true })
  experience?: Experience;
}

@ObjectType()
export class EduResponse extends FieldErrorArray {
  @Field(() => Education, { nullable: true })
  education?: Education;
}

@InputType()
class SocialInput {
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

@InputType()
export class ProfileInputType {
  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  location?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  githubusername?: string;

  // skills comma seperated
  @Field(() => String)
  skills: string;

  // @Field(() => [Experience])
  // experiences: Experience[];

  // @Field(() => [Eduction])
  // eductions: Eduction[];

  @Field(() => SocialInput, { nullable: true })
  social?: SocialInput;
}

@InputType()
export class ExpInput {
  @Field()
  title: string;

  @Field()
  company: string;

  @Field({ nullable: true })
  location: string;

  @Field(() => Date)
  from: Date;

  @Field(() => Date, { nullable: true })
  to: Date;

  @Field({ nullable: true })
  current: boolean;

  @Field({ nullable: true })
  description: string;
}

@InputType()
export class EduInput {
  @Field({ nullable: true })
  school: string;

  @Field({ nullable: true })
  degree: string;

  @Field({ nullable: true })
  fieldofstudy: string;

  @Field(() => Date)
  from: Date;

  @Field(() => Date, { nullable: true })
  to: Date;

  @Field()
  current: boolean;

  @Field({ nullable: true })
  description: string;
}
