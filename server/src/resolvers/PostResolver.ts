import { Post, PostModel, Like } from '../entities/Post';
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';
import { validate } from 'class-validator';
import { ObjectId } from 'mongodb';
import { PostArgs, PostResponse } from '../types/PostTypes';
import { MyContext } from '../MyContext';
import { isAuth } from '../middlewares/isAuth';
import { extractFieldErrors } from '../utils/extractFieldErrors';
import { User } from '../entities/User';
import { Comment, CommentModel } from '../entities/Comment';

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  user(@Root() post: Post, @Ctx() { userLoader }: MyContext): Promise<User> {
    return userLoader.load(post.user as ObjectId);
  }

  @FieldResolver(() => [Comment])
  comments(@Root() post: Post) {
    return CommentModel.find({ post: post._id }).sort({ createdAt: -1 });
  }

  @FieldResolver(() => Int)
  likeCount(@Root() post: Post) {
    return post.likes.reduce((prev, curr) => {
      if (curr.value === 1) prev += 1;
      return prev;
    }, 0);
  }

  @FieldResolver(() => Int)
  dislikeCount(@Root() post: Post) {
    return post.likes.reduce((prev, curr) => {
      if (curr.value === -1) prev += 1;
      return prev;
    }, 0);
  }

  @FieldResolver(() => Int, { nullable: true })
  userLike(@Root() post: Post, @Ctx() { req }: MyContext) {
    return post.likes.find((l) => l.user == req.session.userId)?.value;
  }

  // QUERY POST
  @Query(() => [Post])
  getPosts() {
    return PostModel.find().populate('likes').sort({ createdAt: -1 });
  }

  @Query(() => Post, { nullable: true })
  getOnePost(@Arg('postId', () => ID) postId: ObjectId) {
    return PostModel.findById(postId).populate('likes');
  }

  // ADD POST

  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async addPost(@Args() { title, body }: PostArgs, @Ctx() { req }: MyContext) {
    try {
      const post = new PostModel({ title, body, user: req.session.userId! });
      const validationErrors = await validate(post);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      await post.save();
      return { post };
    } catch (err) {
      console.log(err);
      return {
        errors: [{ path: 'unknown', message: 'Unable to add post' }],
      };
    }
  }

  // EDIT POST
  @Mutation(() => PostResponse)
  async editPost(
    @Arg('postId', () => ID!) postId: ObjectId,
    @Args() { title, body }: PostArgs,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    try {
      const post = await PostModel.findOneAndUpdate(
        { _id: postId, user: req.session.userId! },
        { $set: { title, body } }
      );
      if (!post) throw new Error('Unable to find or edit post');
      const validationErrors = await validate(post);
      if (validationErrors.length > 0) {
        return { errors: extractFieldErrors(validationErrors) };
      }
      return { post };
    } catch (err) {
      console.error(err);
      return {
        errors: [{ path: 'unknown', message: 'Unable to update post' }],
      };
    }
  }

  // DELETE POST
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Arg('postId', () => ID) postId: ObjectId,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      await PostModel.findOneAndDelete({
        _id: postId,
        user: req.session.userId!,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  // LIKE POST
  @Mutation(() => Boolean)
  async toggleLike(
    @Arg('postId', () => ID) postId: ObjectId,
    @Arg('value', () => Int) value: 1 | -1,
    @Ctx() { req }: MyContext
  ) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) throw new Error('Post not found');
      const existingLike = post.likes.find((l) => l.user == req.session.userId);
      if (existingLike) {
        post.likes = post.likes.filter((l) => l._id != existingLike._id);
        if (existingLike.value !== value)
          post.likes.push({ user: req.session.userId!, value } as Like);
      } else {
        post.likes.push({ user: req.session.userId!, value } as Like);
      }
      await post.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
