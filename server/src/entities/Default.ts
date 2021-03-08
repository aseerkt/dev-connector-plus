import { Field, ID, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';

@ObjectType()
export class IdOnly {
  @Field(() => ID)
  readonly _id: ObjectId;
}

@ObjectType()
export class Default extends IdOnly {
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
