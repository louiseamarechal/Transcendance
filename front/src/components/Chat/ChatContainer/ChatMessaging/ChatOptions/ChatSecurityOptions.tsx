import { useUser } from '../../../../../hooks/useUser';
import { Channel } from '../../../../../types/Channel.type';

const ChatSecurityOptions = ({ channel }: { channel: Channel }) => {
  const { myId } = useUser();

  return (
    <div className="security-options">
      {channel.ownerId === myId ? (
        <></> // Case for owner
      ) : channel.admins.some(
          (admin: { userId: number }) => admin.userId === myId,
        ) ? (
        <></> // Case for admin
      ) : (
        <p>Contact channel owner or admin for admin rights.</p> // Case for member
      )}
    </div>
  );
};

export default ChatSecurityOptions;
