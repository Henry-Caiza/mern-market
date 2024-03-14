import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
import { Input } from "@nextui-org/react"


function Signin() {

    const [formData, setFormData] = useState({ email: '', password: '' })
    const { loading, error } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            dispatch(signInStart())
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            console.log(data);
            if (data.success === false) {
                dispatch(signInFailure(data.message))
                return
            }
            dispatch(signInSuccess(data))
            navigate('/')
        } catch (error) {
            dispatch(signInFailure(error.message))
        }

    }

    return (
        <main className=' w-full h-screen mx-auto flex bg-[url("https://i.imgur.com/rYknvdE.png")] bg-no-repeat bg-cover bg-center '>
            <div className='md:w-8/12 hidden md:flex'>
            </div>
            <div className='w-full md:w-5/12  bg-gray-200/50 backdrop-blur-sm px-4 md:px-8 lg:px-16'>
                <h1 className='text-3xl text-gray-700 text-center font-bold mt-12 mb-7 '>Hello! <br />Welcome Back</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Input isRequired type='email' label='Email' variant='underlined' id='email' onChange={handleChange} />
                    <Input isRequired type='password' label='Password' variant='underlined' id='password' onChange={handleChange} />
                    <button disabled={loading} className='bg-slate-700 text-white  p-3 rounded-full uppercase hover:opacity-95 disabled:opacity-80 transition mt-6'>{loading ? 'Loading...' : 'Sign in'}
                    </button>
                    <OAuth />
                </form>
                <div className='flex gap-2 mt-5'>
                    <p className='text-gray-700'>Dont have an account?</p>
                    <Link to='/sign-up'>
                        <span className='text-black'>Sign up</span>
                    </Link>
                </div>
                {error && <p className='text-red-500 mt-5'>{error}</p>}
            </div>

        </main>
    )
}

export default Signin