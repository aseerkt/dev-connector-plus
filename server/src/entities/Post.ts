import {
  getModelForClass,
  modelOptions,
  Ref,
  prop,
} from '@typegoose/typegoose';
import { IsNotEmpty } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import { Default, IdOnly } from './Default';
import { User } from './User';

@ObjectType()
export class Like extends IdOnly {
  @Field(() => User)
  @prop({ ref: User, required: true })
  user: Ref<User>;

  @Field(() => Int)
  @prop({ required: true })
  value: 1 | -1;
}

@modelOptions({ schemaOptions: { timestamps: true } })
@ObjectType()
export class Comment extends Default {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Field()
  @prop({ required: true })
  text: string;

  @Field(() => User)
  @prop({ ref: User, required: true })
  user: Ref<User>;
}

@ObjectType()
export class Post extends Default {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Field()
  @IsNotEmpty({ message: 'Title is required' })
  @prop({ required: true })
  title: string;

  @Field({ nullable: true })
  @prop()
  body: string;

  @prop({ ref: User, required: true })
  user: Ref<User>;

  @prop({ type: () => [Like] })
  likes: Like[];

  @Field(() => [Comment])
  @prop({ type: () => [Comment] })
  comments: Comment[];

  // Virutal fields

  @Field(() => Int)
  public likesCount: number;

  @Field(() => Int, { nullable: true })
  userLike: 1 | -1 | null;
}

export const PostModel = getModelForClass(Post, {
  schemaOptions: { timestamps: true },
});
