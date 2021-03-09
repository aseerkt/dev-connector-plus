import { ArgsType, Field, ObjectType } from 'type-graphql';
import { Post } from '../entities/Post';
import { FieldErrorArray } from '../types';

@ObjectType()
export class PostResponse extends FieldErrorArray {
  @Field(() => Post, { nullable: true })
  post?: Post;
}

@ArgsType()
export class PostArgs {
  @Field()
  title: string;
  @Field({ nullable: true })
  body?: string;
}
