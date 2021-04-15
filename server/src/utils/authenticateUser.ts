import { AuthenticationError } from 'apollo-server-express';
import { UserModel } from '../entities/User';
import { MyContext } from '../MyContext';
import { extractTokenFromCookie, verfiyToken } from './tokenHandler';

export const authenticateUser = async ({ req, res }: MyContext) => {
  try {
    const token = extractTokenFromCookie(req);
    console.log(req.cookies);
    if (!token) {
      console.log('no token');
      throw Error('oops');
    }
    const { userId }: any = verfiyToken(token);
    // console.log(userId);
    if (!userId) {
      console.log('no userId in token');
      throw Error('oops');
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      console.log('no user in token');
      throw Error('oops');
    }
    // console.log(user);
    res.locals.userId = userId;
  } catch (err) {
    const authError = new AuthenticationError('Not Authenticated');
    throw authError;
  }
};
