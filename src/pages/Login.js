import { React, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { auth } from '../firebase.js'
import {signInWithEmailAndPassword } from "firebase/auth";

//https://firebase.google.com/docs/auth/web/password-auth

const Login = () => {
  const [err,setErr] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault()
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch(err) {
      setErr(true)
    }    
  }

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className="logo">myChat</span>
            <span className="title">Inloggen</span>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password'/>

                <button>Inloggen</button>
            </form>
            <p>Nog geen account? <Link to="/register">Registeer</Link></p>
        </div>
    </div>
  )
}

export default Login