import { useState } from 'react'

type Messages = {
    body: string,
    from: string
}

type FormMessageProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socketIo: any,
    messages: Messages[],
    setMessages: React.Dispatch<React.SetStateAction<Messages[]>>
}
function FormMessage({socketIo, messages, setMessages}: FormMessageProps) {


    const [message,setMessage] = useState('')



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const newMessage = {
            body: message,
            from: 'Me'
        }
        e.preventDefault()
        setMessages([...messages, newMessage])
        socketIo.emit('message', message)
    }



    return (
        <form onSubmit={handleSubmit} className='bg-gray-700 p-4 rounded-lg flex flex-row gap-2 mt-4'>
            <input type="text" placeholder='Type your message' className='bg-gray-800 w-full text-white p-3 rounded-lg' 
            onChange = {(e) => setMessage(e.target.value)}
            />
            <button className='text-white font-bold'>Send</button>
        </form>
    )
}

export default FormMessage