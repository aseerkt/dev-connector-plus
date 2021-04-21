import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../MyContext';
import { authenticateUser } from '../utils/authenticateUser';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  try {
    await authenticateUser(context);
    return next();
  } catch (err) {
    throw err;
  }
};
