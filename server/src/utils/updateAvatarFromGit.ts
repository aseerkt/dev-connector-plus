import { ObjectId } from 'mongodb';
import { UserModel } from '../entities/User';
import getAvatarFromGit from './getAvatarFromGit';

export default async function updateAvatarFromGit(
  username: string | undefined,
  userId: ObjectId
) {
  if (!username) return;
  const avatar_url = await getAvatarFromGit(username);
  if (avatar_url) {
    await UserModel.update({ _id: userId }, { $set: { avatar: avatar_url } });
  }
}
