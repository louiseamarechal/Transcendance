import { useUser } from '../../../hooks/useUser';
import { User } from '../../../types/User.type';
import ChatBody from '../../../components/Chat/ChatContainer/ChannelMessaging/ChatBody';
import JoinChannel from '../../../components/Chat/ChatContainer/ChannelMessaging/JoinChannel';
import useChannel from '../../../hooks/useChannel';

export default function ChannelMessaging() {
  const { myId } = useUser();
  const channelState = useChannel();

  if (
    !channelState.self.members.some((m: { user: User }) => m.user.id === myId)
  ) {
    return <JoinChannel />;
  } else {
    return <ChatBody />;
  }
}
