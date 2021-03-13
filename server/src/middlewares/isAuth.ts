import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../MyContext';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    if (!context.req.session.userId) {
      throw new AuthenticationError('Not Authenticated');
    }
    return next();
  } catch (err) {
    throw new AuthenticationError(err.message);
  }
};
