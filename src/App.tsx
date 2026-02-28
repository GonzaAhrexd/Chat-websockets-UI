import { useEffect,  } from 'react'
import useUsernameStore from './zustand'
import { SocketContext } from './context/context-socket'
import { useContext } from 'react'
import './App.css'
import FormMessage from './components/FormMessage'
import SelectUserName from './components/SelectUserName'


function App() {



  const { username } = useUsernameStore()
  const {  messages, isTyping } = useContext(SocketContext) || {} 

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
                {messages?.map((msg, index) => (

                    <div key={index} className={`flex items-center mb-3 ${msg.from.username === username ? 'justify-end' : 'justify-start'}`}>
                      {msg.from.username !== username &&
                        <div style={{backgroundColor: msg.from.color}} className={`flex items-center justify-center rounded-full w-10 h-10 text-lg font-bold text-white mr-2 shadow-md`}>
                          {msg.from.username.charAt(0).toUpperCase()}
                        </div>
                        }
                      <div className={`rounded-xl px-4 py-2 max-w-xs text-white shadow-md transition-all ${msg.from.username === username ? 'bg-linear-to-r from-gray-800 to-gray-900' : 'bg-gray-700/80'}`}>
                        <p className='text-xs font-semibold text-gray-300'>{msg.from.username}</p>
                        <p className='mt-1'>{msg.body}</p>
                        <p className='text-xs text-gray-400 mt-1'>{msg.time}</p>
                      </div>

                  </div>
                ))}
                {isTyping?.isTyping && isTyping.user != username ?
                  <div className='flex justify-start mb-2 animate-pulse'>
                    <div className='bg-gray-700/60 text-white rounded-xl px-4 py-2 max-w-xs border border-gray-600'>
                      <p className='text-xs font-semibold text-gray-300'>{isTyping.user}</p>
                      <p className='text-gray-400 italic'>typing...</p>
                    </div>
                  </div>
                  : null}
              </ul>
              <FormMessage  />
            </div>
          </div>
        )
      }

    </>
  )
}

export default App
