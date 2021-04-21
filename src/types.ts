import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FieldError {
  @Field()
  path: string;
  @Field()
  message: string;
}

@ObjectType()
export class FieldErrorArray {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
