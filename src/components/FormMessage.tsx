import { useContext, useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import useUsernameStore from '../zustand'
import { SocketContext } from '../context/context-socket'


function FormMessage() {

    const { Socket: socketIo, messages, setMessages } = useContext(SocketContext) 


    const [message, setMessage] = useState('')
    const { username } = useUsernameStore()



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const newMessage = {
            body: message,
            from: {
                username: username,
                id: '',
                color: ''
            },
            time: (new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0'))
        }
        e.preventDefault()
        setMessages([...messages, newMessage])
        socketIo?.emit('message', newMessage)
        setMessage('')
    }



    return (
        <form onSubmit={handleSubmit} className='bg-gray-700/50 p-3 rounded-xl flex flex-row gap-3 mt-4 border border-gray-600'>
            <input value={message} type="text" placeholder='Type your message...' className='bg-gray-800/80 w-full text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-500'
                onChange={(e) => {
                    setMessage(e.target.value)
                    socketIo?.emit('typing', { user: username, isTyping: e.target.value.length > 0 })
                }
                }
            />
            <button className='text-white font-bold bg-linear-to-r from-gray-800 to-gray-900 rounded-xl px-4 py-2 hover:from-gray-700 hover:to-gray-800 cursor-pointer transition-all shadow-md hover:shadow-lg active:scale-95'><PaperAirplaneIcon className='w-6 h-6' /></button>
        </form>
    )
}

export default FormMessage