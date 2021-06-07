import axios from 'axios';

export default async function getAvatarFromGit(username: string) {
  try {
    const res = await axios(`https://api.github.com/users/${username}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.data) {
      return res.data.avatar_url;
    }
  } catch (err) {
    console.log('Unable to find avatar with this github username');
  }
}
