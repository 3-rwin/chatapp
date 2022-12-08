import React, { useContext, useState } from 'react'
import Img from "../img/img.png"
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
// npm install uuid
import { v4 as uuid } from 'uuid';
import { db, storage } from '../firebase'
import { arrayUnion, updateDoc, Timestamp, doc, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

// How to update elements in an array
// https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array

const Input = () => {
  const [text, setText] = useState("")
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    
    if(img){
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadUrl,
              }),
            });
          });
        }
      );

    } else {
      if(text) {
        console.log("data: ", data.chatId)
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId:currentUser.uid,
            date:Timestamp.now(),
          }),
        });

        await updateDoc(doc(db,"userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]:{
            text,
          },
          [data.chatId+".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db,"userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]:{
            text,
          },
          [data.chatId+".date"]: serverTimestamp(),
        });

        setText("");
        setImg(null);
      }
    }
  }

  return (
    <div className='input'>
    {!(data.chatId === "null") &&
    <>
      <input 
        type="text" 
        placeholder='Type something...' 
        onChange={(e)=>setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input 
          type="file" 
          id="file" 
          onChange={(e)=>setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </>}
    </div>
  )
}

export default Input