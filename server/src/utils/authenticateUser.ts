import { AuthenticationError } from 'apollo-server-express';
import { UserModel } from '../entities/User';
import { MyContext } from '../MyContext';
import { extractTokenFromCookie, verfiyToken } from './tokenHandler';

export const authenticateUser = async ({ req, res }: MyContext) => {
  try {
    const token = extractTokenFromCookie(req);
    if (!token) {
      console.log('no token');
      throw Error('oops');
    }
    const { userId }: any = verfiyToken(token);
    if (!userId) {
      console.log('no userId in token');
      throw Error('oops');
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log('no user in token');
      throw Error('oops');
    }
    res.locals.userId = user._id;
  } catch (err) {
    const authError = new AuthenticationError('Not Authenticated');
    throw authError;
  }
};
