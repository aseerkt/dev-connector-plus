import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';
import { User, UserModel } from '../entities/User';

export const createUserLoader = () =>
  new DataLoader<ObjectId, User>(async (userIds) => {
    const users = await UserModel.find({ _id: { $in: userIds as ObjectId[] } });
    // console.log('dataloader user', users);
    let userIdToUser: Record<string, User> = {};
    users.forEach((u) => {
      userIdToUser[`${u._id}`] = u;
    });
    return userIds.map((_id) => userIdToUser[`${_id}`]);
  });
