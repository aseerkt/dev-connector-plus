import { Post, PostModel, Like, Comment } from '../entities/Post';
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

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => User)
  user(@Root() post: Post, @Ctx() { userLoader }: MyContext): Promise<User> {
    return userLoader.load(post.user as ObjectId);
  }

  @FieldResolver(() => Int)
  likesCount(@Root() post: Post) {
    return post.likes.reduce((prev, curr) => {
      prev += curr.value;
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
    return PostModel.find().populate('likes comments').sort({ createdAt: -1 });
  }

  @Query(() => Post, { nullable: true })
  getOnePost(@Arg('postId', () => ID) postId: ObjectId) {
    return PostModel.findById(postId).populate('likes comments');
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
        errors: [{ path: 'unknown', message: 'Unable to update profile' }],
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
    @Arg('value') value: 1 | -1,
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

  // ADD COMMENT
  @Mutation(() => Comment, { nullable: true })
  async addComment(
    @Arg('text') text: string,
    @Arg('postId', () => ID) postId: ObjectId,
    @Ctx() { req }: MyContext
  ): Promise<Comment | undefined> {
    try {
      const post = await PostModel.findById(postId);
      if (!post) throw new Error('Post not found');

      post.comments.push({ text, user: req.session.userId! } as Comment);
      await post.save();
      return post.comments[post.comments.length - 1];
    } catch (err) {
      console.log(err);
      return;
    }
  }

  @Mutation(() => Boolean)
  async deleteComment(
    @Arg('postId', () => ID) postId: ObjectId,
    @Arg('commentId', () => ID) commentId: ObjectId,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const post = await PostModel.findById(postId);
      if (!post) throw new Error('Post not found');

      post.comments = post.comments.filter(
        (c) => c._id != commentId && c.user == req.session.userId
      );
      await post.save();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
