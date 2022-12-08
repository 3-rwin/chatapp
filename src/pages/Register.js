import React, { useState } from 'react'
import Add from "../img/addAvatar.png"
import { Link, useNavigate } from "react-router-dom"
// Firebase authentication docs: https://firebase.google.com/docs/auth/web/password-auth
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
// https://firebase.google.com/docs/storage/web/upload-files
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// https://firebase.google.com/docs/firestore/manage-data/add-data
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [err,setErr] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault()
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)

      // Set the filename to the displayName
      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          setErr(true);
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then( async(downloadURL) => {
            console.log('File available at', downloadURL);
            await updateProfile(res.user,{
              displayName,
              photoURL: downloadURL,
            });
            // Create an entry for this user in the users database in fireStore.
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            })
            // Create an entry for all the chats of this user in the users db in firestore.
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );

    } catch(err) {
      setErr(true)
    }    
  }

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className="logo">myChat</span>
            <span className="title">Registreer</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='display name'/>
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password'/>
                <input type="file" id="file"/>
                <label htmlFor="file">
                    <img src={Add} alt="" />
                    <span>Voeg avatar toe</span>
                </label>
                <button>Registreren</button>
                {err && <span>Er ging iets mis</span>}
            </form>
            <p>Heb je al een account? <Link to="/login">Inloggen</Link></p>
        </div>
    </div>
  )
}

export default Register