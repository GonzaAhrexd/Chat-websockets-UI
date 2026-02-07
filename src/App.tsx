import io from 'socket.io-client'
import { useEffect, useState, useRef } from 'react'
import useUsernameStore from './zustand'
const socketIo = io('/')

import './App.css'
import FormMessage from './components/FormMessage'
import SelectUserName from './components/SelectUserName'

function App() {

  const [messages, setMessages] = useState<{ body: string, from: string }[]>([])
  const [isTyping, setIsTyping] = useState<{ user: string, isTyping: boolean }>({ user: '', isTyping: false })
  const typingTimeoutRef = useRef<number | null>(null)

  const { username } = useUsernameStore()

  const receiveMessage = (message: { body: string, from: string }) => {
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
    socketIo.on('message', receiveMessage)
    socketIo.on('typing', detectTyping)

    return () => {
      socketIo.off('message', receiveMessage)
      socketIo.off('typing', detectTyping)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    console.log('isTyping updated:', isTyping)
  }, [isTyping])

  return (
    <>
      <h1 className='text-white text-4xl flex justify-center items-center font-bold mt-2'>SUPER CHAT</h1>
      {username && <p className='text-gray-400 text-center'>Logged in as: <span className='text-white font-bold'>{username}</span></p>}
      {!username ? <SelectUserName /> :
        (
          <div className='flex justify-center items-center w-full h-screen'>
            <div className='bg-gray-950 w-1/2 h-3/4 rounded-lg p-4'>
              <ul className='bg-gray-800 h-[85%] rounded-lg p-4'>
                {messages.map((msg, index) => (
                  <div key={index} className={msg.from === username ? 'flex justify-end mb-2' : 'flex justify-start mb-2'}>
                    <div className={msg.from === username ? 'bg-gray-900 text-white rounded-lg px-4 py-2 max-w-xs' : 'bg-gray-700 text-white rounded-lg px-4 py-2 max-w-xs'}>
                      <p className='text-sm font-semibold'>{msg.from}</p>
                      <p>{msg.body}</p>
                    </div>
                  </div>
                ))}
                {/* Haz que salga abajo y diga que está escribiendo */}
                {isTyping.isTyping && isTyping.user != username ? 
                   <div className={isTyping.user === username ? 'flex justify-end mb-2' : 'flex justify-start mb-2'}>
                    <div className={isTyping.user === username ? 'bg-gray-900 text-white rounded-lg px-4 py-2 max-w-xs' : 'bg-gray-700 text-white rounded-lg px-4 py-2 max-w-xs'}>
                      <p className='text-sm font-semibold'>{isTyping.user}</p>
                      <p>is typing...</p>
                    </div>
                  </div>
                : null}
              </ul>
              <FormMessage socketIo={socketIo} messages={messages} setMessages={setMessages} />
            </div>
          </div>
        )
      }

    </>
  )
}

export default App
