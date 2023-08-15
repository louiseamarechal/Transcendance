import { useEffect, useState } from 'react';
import useChannel from '../../../../hooks/useChannel';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { Message } from '../../../../types/Message.type';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../../../../hooks/useUser';
import '../../../../style/components/chat/chat-container/chat-messaging/chat-body.css';
import { channelSocket, notifSocket } from '../../../../api/socket';

export default function ChatBody() {
  const axiosInstance = useAxiosPrivate();
  const { myId, myLogin } = useUser();
  const channelState = useChannel();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [reloadMessage, setReloadMessage] = useState(true);

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
          console.log(`type of message.createAt: ${typeof message.createdAt}`);
          setCurrentMessage('');
        });

      channelSocket.emit('client.channel.sendMessage', channelState.self.id);
      channelState.self.members.map((member) => {
        if (member.user?.login !== myLogin) {
          console.log(`sending chat notif on socket for ${member.user?.login}`);
          notifSocket.emit('client.notif.chatNotif', member.user?.login);
        }
      });
      console.log({ channelMembers: channelState.self.members });
    }
  };

  function formatDate(bigDate: string): string {
    const date: Date = new Date(bigDate);
    return date.toLocaleString();
  }

  async function uploadMessages() {
    await axiosInstance.get(`message/${channelState.self.id}`).then((res) => {
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
          onKeyUp={(event) => {
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
}
