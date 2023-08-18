import { useUser } from '../../../hooks/useUser';
import { User } from '../../../types/User.type';
import useChannel from '../../../hooks/useChannel';
import JoinChannel from '../../../components/chat/chat-channel/channel-messaging/JoinChannel';
import ChatBody from '../../../components/chat/chat-channel/channel-messaging/ChatBody';

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
