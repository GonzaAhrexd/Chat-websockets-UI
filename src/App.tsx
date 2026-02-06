import io from 'socket.io-client'
import { useEffect, useState } from 'react'
const socketIo = io('/')

import './App.css'
import FormMessage from './components/FormMessage'

function App() {

  const [messages, setMessages] = useState<{body: string, from: string}[]>([])
 const receiveMessage = (message: {body: string, from: string}) => {
    setMessages(state => [...state, message])
  }

  useEffect(() => {
    
    socketIo.on('message', receiveMessage)

    return () => {
      socketIo.off('message', receiveMessage)
    }
  }, [])

 

  return (
    <>
    <h1 className='text-white text-4xl flex justify-center items-center font-bold mt-5'>SUPER CHAT</h1>
    <div className='flex justify-center items-center w-full h-screen'>
      <div className='bg-gray-950 w-1/2 h-3/4 rounded-lg p-4'>
      {/* Chat messages will go here */}
      <ul className='bg-gray-800 h-[85%] rounded-lg p-4'>
        {messages.map((msg, index) => (
          <li key={index} className="text-white mb-2">
            {msg.from}: {msg.body}
          </li>
        ))}
      </ul>
      <FormMessage socketIo={socketIo} messages={messages} setMessages={setMessages} />
      </div>
    </div>

    </>
  )
}

export default App
