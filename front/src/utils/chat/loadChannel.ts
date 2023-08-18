import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useRefreshToken from '../../hooks/useRefreshToken';
import { Channel } from '../../types/Channel.type';

// export default async function loadChannel({ params }): Promise<Channel> {
export default async function loadChannel({ params }) {
  const refresh = useRefreshToken();
  // const { auth };
  console.log(typeof params);
  return refresh;
}
