import { useContext } from 'react';
import { ChatContext } from '../context/ChatProvider';


export const useChatContext = () => {
  return useContext(ChatContext);
};
