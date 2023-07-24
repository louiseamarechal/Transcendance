import { useState } from 'react';
import { Message } from '../../../../types/Message.type';
import { Channel } from '../../../../types/Channel.type';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ScrollToBottom from 'react-scroll-to-bottom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../../../../hooks/useUser';
import "../../../../style/components/chat/chat-container/chat-messaging/chat-body.css"

const ChatBody = ({ channel }: { channel: Channel }) => {
  const axiosInstance = useAxiosPrivate();
  const { myId } = useUser();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (currentMessage !== '') {
      axiosInstance.post(
        `message/${channel.id}`,
        {
          body: currentMessage,
        },
      ).then((res) => {
				const {createdAt, ...obj} = res.data;
				const date: Date = new Date(createdAt);
				const message: Message = {...obj, createdAt: date};
				setMessageList((list) => [...list, message]);
				console.log(`type of message.createAt: ${typeof(message.createdAt)}`);
				setCurrentMessage("");
			});
      // Send socket message.
    }
  };

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
                    <p id="time">{messageContent.createdAt.toLocaleString()}</p>
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
