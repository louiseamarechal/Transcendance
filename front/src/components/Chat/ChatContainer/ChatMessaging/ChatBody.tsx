import { useEffect, useState } from 'react';
import { Message } from '../../../../types/Message.type';
import { Channel } from '../../../../types/Channel.type';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../../../../hooks/useUser';
import '../../../../style/components/chat/chat-container/chat-messaging/chat-body.css';
import { channelSocket, notifSocket } from '../../../../api/socket';

const ChatBody = ({ channel }: { channel: Channel }) => {
  const axiosInstance = useAxiosPrivate();
  const { myId, myLogin } = useUser();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [reloadMessage, setReloadMessage] = useState(true);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      axiosInstance
        .post(`message/${channel.id}`, {
          body: currentMessage,
        })
        .then((res) => {
          const { createdAt, ...obj } = res.data;
          const date: Date = new Date(createdAt);
          const message: Message = { ...obj, createdAt: date };
          setMessageList((list) => [...list, message]);
          console.log(`type of message.createAt: ${typeof message.createdAt}`);
          setCurrentMessage('');
        });
      channelSocket.emit('client.channel.sendMessage', channel.id);
      notifSocket.emit('client.notif.chatNotif', myLogin);
      // Send socket message.
    }
  };

  function formatDate(bigDate: string): string {
    const date: Date = new Date(bigDate);
    return date.toLocaleString();
  }

  async function uploadMessages() {
    await axiosInstance.get(`message/${channel.id}`).then((res) => {
      // const {createdAt, ...obj} = res.data;
      setMessageList(res.data);
    });
  }

  if (reloadMessage === true) {
    uploadMessages();
    setReloadMessage(false);
  }

  useEffect(() => {
    function onMessageUpdate() {
      setReloadMessage(true);
    }

    channelSocket.on('server.channel.messageUpdate', onMessageUpdate);

    return () => {
      channelSocket.off('server.channel.messageUpdate', onMessageUpdate);
    };
  }, [reloadMessage, setReloadMessage]);

  return (
    <div className="chat-window">
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={myId === messageContent.senderId ? 'you' : 'other'}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.body}</p>
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
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <div className="send-button" onClick={() => sendMessage()}>
          <FontAwesomeIcon
            className="fa-lg fa-regular"
            icon={faPaperPlane}
            style={{ color: 'var(--black)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
