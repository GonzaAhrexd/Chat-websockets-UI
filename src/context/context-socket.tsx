import { createContext, useRef } from 'react';
import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
const Context = createContext({});
import client, { Socket } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';

export function ContextSocketProvider({ children }: { children: ReactNode }) {
    const [Socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [messages, setMessages] = useState<{ body: string, from: { username: string, id: string, color: string }, time: string }[]>([])
    const [isTyping, setIsTyping] = useState<{ user: string, isTyping: boolean }>({ user: '', isTyping: false })
      const typingTimeoutRef = useRef<number | null>(null)
    
   const receiveMessage = (message: { body: string, from: { username: string, id: string, color: string }, time: string }) => {
    setMessages(state => [...state, message])
  }

  const detectTyping = (data: { user: string, isTyping: boolean }) => {
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
      socket.off('message', receiveMessage)
      socket.off('typing', detectTyping)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
       
    }, []);

    return <Context.Provider value={{ Socket, messages, isTyping }}> {children} </Context.Provider>;
}