import { Field, ID, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class Default {
  @Field(() => ID)
  readonly _id: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
