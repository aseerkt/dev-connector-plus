import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import { Default } from './Default';
import { Post } from './Post';
import { User } from './User';

// @modelOptions({ schemaOptions: { timestamps: true } })
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

  @Field(() => Post)
  @prop({ ref: Post, required: true })
  post: Ref<Post>;
}

export const CommentModel = getModelForClass(Comment, {
  schemaOptions: { timestamps: true },
});
