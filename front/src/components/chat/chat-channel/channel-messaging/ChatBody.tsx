import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { channelSocket, notifSocket } from '../../../../api/socket';
import { useUser } from '../../../../hooks/useUser';
import { Message } from '../../../../types/Message.type';
import ScrollToBottom from 'react-scroll-to-bottom';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import useChannel from '../../../../hooks/useChannel';

export default function ChatBody() {
  const axiosInstance = useAxiosPrivate();
  const { myId, myLogin } = useUser();
  const channelState = useChannel();
  const [blockedUsers, setBlockedUsers] = useState<number[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [MessageReceived, setMessageReceived] = useState(false);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      axiosInstance
        .post(`message/${channelState.self.id}`, {
          body: currentMessage,
        })
        .then((res) => {
          const { createdAt, ...obj } = res.data;
          const date: Date = new Date(createdAt);
          const message: Message = { ...obj, createdAt: date };
          setMessageList((list) => [...list, message]);
          setCurrentMessage('');
        });

      channelSocket.emit('client.channel.sendMessage', channelState.self.id);
      channelState.self.members.map((member) => {
        if (member.user.login !== myLogin) {
          notifSocket.emit('client.notif.chatNotif', member.user?.login);
        }
      });
    }
  };

  function formatDate(bigDate: string): string {
    const date: Date = new Date(bigDate);
    return date.toLocaleString();
  }

  useEffect(() => {
    console.log('Call blocked users.');
    axiosInstance.get(`user/blocked`).then((res) => {
      setBlockedUsers(res.data);
    });
  }, []);

  async function updateMessages() {
    await axiosInstance.get(`message/${channelState.self.id}`).then((res) => {
      setMessageList(res.data);
    });
  }

  if (MessageReceived === true) {
    updateMessages();
    setMessageReceived(false);
  }

  channelSocket.on('server.channel.messageUpdate', () =>
    setMessageReceived(true),
  );

  useEffect(() => {
    updateMessages();
    return () => {
      channelSocket.off('server.channel.messageUpdate', () =>
        setMessageReceived(true),
      );
    };
  }, [MessageReceived, channelState]);

  return (
    <div className="chat-window">
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent: Message) => {
            return (
              <div
                key={`message-${messageContent.id}`}
                className={
                  'message ' +
                  (myId === messageContent.senderId ? 'you' : 'other')
                }
              >
                <div>
                  <div
                    className="message-content"
                    id={
                      blockedUsers.includes(messageContent.senderId)
                        ? 'muted-message'
                        : ''
                    }
                  >
                    {blockedUsers.includes(messageContent.senderId) ? (
                      <p></p>
                    ) : (
                      <p>{messageContent.body}</p>
                    )}
                  </div>
                  <div className="message-meta">
                    <p id="time">{formatDate(messageContent.createdAt)}</p>
                    <p id="author">{messageContent.sender.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyUp={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <div className="send-button" onClick={() => sendMessage()}>
          <FontAwesomeIcon
            className="fa-sm fa-regular"
            icon={faPaperPlane}
            style={{ color: 'var(--black)' }}
          />
        </div>
      </div>
    </div>
  );
}
