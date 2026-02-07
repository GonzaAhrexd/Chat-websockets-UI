import { create } from 'zustand'


type userName = {
    username: string,
    setUsername: (name: string) => void
}


const useUsernameStore = create<userName>((set) => ({
    username: '',
    setUsername: (name: string) => set({ username: name }),
}))


export default useUsernameStore