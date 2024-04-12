import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { app } from '../firebase'
import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc"
import { loginGoogleRequest } from '../api/auth'

function OAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await loginGoogleRequest(result)
            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            console.log('could not sign in with google', error);
        }
    }
    return (
        <button onClick={handleGoogleClick} type='button' className='border-2 border-red-700 text-red-700 p-3 rounded-full uppercase hover:bg-red-700 hover:text-white flex items-center justify-center gap-4 transition'>
            <FcGoogle className='w-5 h-5' />
            Login with Google
        </button>
    )
}

export default OAuth