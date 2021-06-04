import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { PostModel } from '../entities/Post';
import { MyContext } from '../MyContext';
import { ObjectId } from 'mongodb';
import { User } from '../entities/User';
import { Comment, CommentModel } from '../entities/Comment';
import { isAuth } from '../middlewares/isAuth';

@Resolver(Comment)
export class CommentResolver {
  @FieldResolver(() => User)
  user(
    @Root() comment: Comment,
    @Ctx() { userLoader }: MyContext
  ): Promise<User> {
    return userLoader.load(comment.user as ObjectId);
  }

  // ADD COMMENT
  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(isAuth)
  async addComment(
    @Arg('text') text: string,
    @Arg('postId', () => ID) postId: ObjectId,
    @Ctx() { res }: MyContext
  ): Promise<Comment | null> {
    try {
      const post = await PostModel.findById(postId).populate('comments');
      if (!post) throw new Error('Post not found');
      console.log(res);

      const comment = new CommentModel({
        text,
        post: post._id,
        user: res.locals.userId,
      } as Comment);
      await comment.save();

      return comment;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @Arg('postId', () => ID) postId: ObjectId,
    @Arg('commentId', () => ID) commentId: ObjectId,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    try {
      const post = await PostModel.findById(postId);
      if (!post) throw new Error('Post not found');

      await CommentModel.findOneAndDelete({
        post: post._id,
        _id: commentId,
        user: res.locals.userId!,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
