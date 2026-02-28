import { createContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';


import client, { Socket } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';


type Message = {
  body: string;
  from: {
    username: string;
    id: string;
    color: string;
  };
  time: string;
}

type TypingStatus = {
  user: string;
  isTyping: boolean;
}

type ContextType = {
  Socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: TypingStatus;
}


export const SocketContext = createContext<ContextType>(
  {
    Socket: null,
    messages: [],
    setMessages: () => { },
    isTyping: { user: '', isTyping: false }
  }
);

export function ContextSocketProvider({ children }: { children: ReactNode }) {
  const [Socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState<TypingStatus>({ user: '', isTyping: false })
  const typingTimeoutRef = useRef<number | null>(null)

  const receiveMessage = (message: Message) => {
    setMessages(state => [...state, message])
  }

  const detectTyping = (data: TypingStatus) => {
    // Limpiar timeout anterior si existe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    setIsTyping(data)

    if (data.isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping({ user: '', isTyping: false })
      }, 1000)
    }
  }




  useEffect(() => {
    const SOCKET_URI = '/'
    const socket = client(SOCKET_URI)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(socket)
    socket.on('message', receiveMessage)
    socket.on('typing', detectTyping)

    return () => {
      // /message 
      socket.off('message', receiveMessage)
      // /typing
      socket.off('typing', detectTyping)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }

  }, []);

  return <SocketContext.Provider value={{ Socket, messages, setMessages, isTyping }}> {children} </SocketContext.Provider>;
}