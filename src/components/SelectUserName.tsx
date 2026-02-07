import useUsernameStore from "../zustand"
import { useState } from "react"

function SelectUserName() {

    const { setUsername } = useUsernameStore()


    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setUsername(name)
    }



    return (
        <div className='flex items-center justify-center min-h-screen w-full '>
            <div className='w-full max-w-md px-6 bg-gray-900 p-10 rounded-lg'>
                <h1 className='text-white text-2xl font-bold mb-6 text-center'>Enter Username</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Enter your username'
                        className='w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none transition'
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                    <button type='submit' className='w-full bg-gray-800 text-white font-bold py-3 rounded-lg mt-4 hover:bg-gray-700 cursor-pointer transition'>
                        Join Chat
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SelectUserName