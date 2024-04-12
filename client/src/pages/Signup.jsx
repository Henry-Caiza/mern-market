import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { Input } from "@nextui-org/react"
import { registerRequest } from '../api/auth';


function Signup() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const data = await registerRequest(formData)
            if (data.success === false) {
                setLoading(false)
                setError(data.message)
                return
            }
            setLoading(false)
            setError(null)
            navigate('/sign-in')
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }

    }

    return (
        <div className='w-full h-screen mx-auto flex  bg-[url("https://i.imgur.com/rYknvdE.png")] bg-no-repeat bg-cover bg-center'>
            <div className='md:w-8/12 hidden md:flex'>
            </div>
            <div className='w-full md:w-5/12  bg-gray-200/50 backdrop-blur-sm px-4 md:px-8 lg:px-16'>
                <h1 className='text-3xl text-gray-700 text-center font-bold mt-12 mb-4 '>Create your <br />Account</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <Input isRequired type='text' label='Username' variant='underlined' id='username' onChange={handleChange} />
                    <Input isRequired type='email' label='Email' variant='underlined' id='email' onChange={handleChange} />
                    <Input isRequired type='password' label='Password' variant='underlined' id='password' onChange={handleChange} />
                    <button disabled={loading} className='bg-slate-700 text-white  p-3 rounded-full uppercase hover:opacity-95 disabled:opacity-80 transition mt-6'>{loading ? 'Loading...' : 'Sign up'}</button>
                    <OAuth />
                </form>
                <div className='flex gap-2 mt-5'>
                    <p className='text-gray-700'>Have an account?</p>
                    <Link to='/sign-in'>
                        <span className='text-black'>Sign in</span>
                    </Link>
                </div>
                {error && <p className='text-red-500 mt-5'>{error}</p>}
            </div>

        </div>
    )
}

export default Signup