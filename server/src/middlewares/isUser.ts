import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../MyContext';
import { authenticateUser } from '../utils/authenticateUser';

export const isUser: MiddlewareFn<MyContext> = async ({ context }, next) => {
  try {
    // console.log(context.req);
    await authenticateUser(context);
    console.log(context.res.locals.userId);
  } catch (err) {
    console.log('from isUser middeware', err.message);
  }
  return next();
};
