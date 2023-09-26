import { useUser } from '../../../hooks/useUser';
import useChannel from '../../../hooks/useChannel';
import JoinChannel from '../../../components/chat/chat-channel/channel-messaging/JoinChannel';
import ChatBody from '../../../components/chat/chat-channel/channel-messaging/ChatBody';
import { PublicUser } from '../../../../../shared/common/types/user.type';

export default function ChannelMessaging() {
  const { myId } = useUser();
  const channelState = useChannel();

  if (
    !channelState.self.members.some(
      (m: { user: PublicUser }) => m.user.id === myId,
    )
  ) {
    return <JoinChannel />;
  } else {
    return <ChatBody />;
  }
}
