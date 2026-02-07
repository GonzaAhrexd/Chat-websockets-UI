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
        <div className='flex items-center justify-center min-h-screen w-full px-4'>
            <div className='w-full max-w-md px-8 bg-gray-900/90 p-10 rounded-2xl shadow-2xl border border-gray-800'>
                <h1 className='text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 text-2xl font-bold mb-6 text-center'>Enter Username</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder='Enter your username'
                        className='w-full bg-gray-800/80 text-white p-3 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-500'
                        onChange={(e) => setName(e.currentTarget.value)}
                    />
                    <button type='submit' className='w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold py-3 rounded-xl mt-4 hover:from-gray-600 hover:to-gray-700 cursor-pointer transition-all shadow-md hover:shadow-lg active:scale-[0.98]'>
                        Join Chat
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SelectUserName