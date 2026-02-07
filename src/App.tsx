import io from 'socket.io-client'
import { useEffect, useState, useRef } from 'react'
import useUsernameStore from './zustand'
const socketIo = io('/')

import './App.css'
import FormMessage from './components/FormMessage'
import SelectUserName from './components/SelectUserName'

function App() {

  const [messages, setMessages] = useState<{ body: string, from: string, time: string }[]>([])
  const [isTyping, setIsTyping] = useState<{ user: string, isTyping: boolean }>({ user: '', isTyping: false })
  const typingTimeoutRef = useRef<number | null>(null)

  const { username } = useUsernameStore()

  const receiveMessage = (message: { body: string, from: string, time: string }) => {
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
      <h1 className='text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 text-4xl flex justify-center items-center font-bold mt-4 mb-2'>SUPER CHAT</h1>
      {username && <p className='text-gray-400 text-center mb-2'>Logged in as: <span className='text-white font-semibold'>{username}</span></p>}
      {!username ? <SelectUserName /> :
        (
          <div className='flex justify-center items-center w-full h-screen px-4'>
            <div className='bg-gray-950 w-full md:w-1/2 h-[80%] md:h-3/4 rounded-xl p-4 shadow-2xl border border-gray-800'>
              <ul className='bg-gray-800/50 h-[85%] rounded-xl p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent'>
                {messages.map((msg, index) => (

                    <div key={index} className={`flex items-center mb-3 ${msg.from === username ? 'justify-end' : 'justify-start'}`}>
                      {msg.from !== username &&
                        <div className='flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold text-white bg-linear-to-br from-blue-400 to-blue-500 mr-2 shadow-md'>
                          {msg.from.charAt(0).toUpperCase()}
                        </div>
                        }
                      <div className={`rounded-xl px-4 py-2 max-w-xs text-white shadow-md transition-all ${msg.from === username ? 'bg-linear-to-r from-gray-800 to-gray-900' : 'bg-gray-700/80'}`}>
                        <p className='text-xs font-semibold text-gray-300'>{msg.from}</p>
                        <p className='mt-1'>{msg.body}</p>
                        <p className='text-xs text-gray-400 mt-1'>{msg.time}</p>
                      </div>

                  </div>
                ))}
                {isTyping.isTyping && isTyping.user != username ?
                  <div className='flex justify-start mb-2 animate-pulse'>
                    <div className='bg-gray-700/60 text-white rounded-xl px-4 py-2 max-w-xs border border-gray-600'>
                      <p className='text-xs font-semibold text-gray-300'>{isTyping.user}</p>
                      <p className='text-gray-400 italic'>typing...</p>
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
