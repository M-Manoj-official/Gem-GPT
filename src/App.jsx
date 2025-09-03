import { useState } from 'react'
import './App.css'
import { Sidebar } from './Components/Sidebar/Sidebar'
import { Chat } from './Components/Chat/Chat'

function App() {
  return (
    <>
      <Sidebar />
      <Chat />
    </>
  )
}

export default App
