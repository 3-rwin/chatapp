import React, { useContext, useState, useEffect } from 'react'
import Message from './Message.js'
import { ChatContext } from '../context/ChatContext.js';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from "../firebase.js"

const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext);

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats", data.chatId), (doc)=> {
      doc.exists() && setMessages(doc.data().messages)
    })

    return ()=>{
      unSub()
    }
  },[data.chatId])

  return (
    <div className='messages'>
      {messages.map((m) => (
        <Message message={m}  key={m.id}/>
      ))}
    </div>
  )
}

export default Messages