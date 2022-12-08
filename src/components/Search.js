import React, { useState, useContext } from 'react'
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { AuthContext } from "../context/AuthContext.js"

// https://firebase.google.com/docs/firestore/query-data/queries

const Search = () => {
  const [username, setUsername] = useState("")
  const [user, setUser] = useState("")
  const [err, setErr] = useState("")

  // Get the current username from AuthContext
  const { currentUser } = useContext(AuthContext) 

  const handleSearch = async ()=> {
    // Querey the database to find the searched username
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        setUser(doc.data())
      });
    } catch(err) {
      setErr(true);
    }
  }

  const handleKey = e=> {
    e.code === "Enter" && handleSearch();
  }

  const handleSelect = async () => {
    // Check wheter the group(chats in firestore) exists, if not: create
    const combinedId = 
      currentUser.uid > user.uid 
      ? currentUser.uid + user.uid 
      : user.uid + currentUser.uid;

      try {
        const res = await getDoc(doc(db, "chats", combinedId));
        console.log("sdadsfsdfs")
        
        if(!res.exists()){
          // Create a chat in chats collection
          await setDoc(doc(db,"chats", combinedId), {messages:[]});
          
          // Create an new entry in userChats for the currentUser
          await updateDoc(doc(db,"userChats", currentUser.uid),{
            [combinedId+".userInfo"]: {
              uid:user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL
            },
            [combinedId+".date"]: serverTimestamp()
          });

          // Create an new entry in userChats for the other user
          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
        }
      } catch(err) {}
    
    setUser(null);
    setUsername("");
  }

  const clearSearch = () => {
    setUser(null);
    setUsername("");
  }

  return (
    <div className='search'>
        <div className="searchPanel">
          <div className="searchForm">
              <input type="text" 
                placeholder="Find a user" 
                onKeyDown={handleKey} 
                onChange={e=>setUsername(e.target.value)}
                value={username}
              />
          </div>
          {username && <div  onClick={clearSearch} className="searchCancel">X</div>}
        </div>
        {err && <span>User not found!</span>}
        {/* If there is a user, show the userchat */}
        {user && <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
                <span>{user.displayName}</span>
            </div>
        </div>}

    </div>
  )
}

export default Search