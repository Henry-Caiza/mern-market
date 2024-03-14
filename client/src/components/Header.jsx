import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { Input } from "@nextui-org/react"
import { useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation()
    const { currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const searchTermFromUrl = urlParams.get("searchTerm")
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search])

    return (
        <header className="bg-gradient-to-b from-primary/90 to-primary  shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-base sm:text-xl flex flex-wrap">
                        <span className="text-slate-200">Cozy</span>
                        <span className="text-slate-900">SoS</span>
                    </h1>
                </Link>

                <form onSubmit={handleSubmit} className='w-1/3'>
                    <Input type="text" placeholder="Search for products..."
                        value={searchTerm}

                        onChange={e => setSearchTerm(e.target.value)}
                        startContent={
                            <button>
                                <FaSearch className='text-slate-600' />
                            </button>
                        }
                    />
                </form>
                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li className={`hidden sm:inline ${location.pathname === '/' ? 'text-slate-100' : 'text-slate-300'}  hover:underline`}>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className={`inline text-sm sm:text-base ${location.pathname === '/about' ? 'text-slate-100' : 'text-slate-300'} hover:underline`}>About</li>
                    </Link>
                    {
                        currentUser && <Link to='/listings'>
                            <li className={`inline text-sm sm:text-base ${location.pathname === '/listings' ? 'text-slate-100' : 'text-slate-300'} hover:underline`}>Listings</li>
                        </Link>
                    }
                    <Link to={currentUser ? '/profile' : '/sign-in'}>
                        {
                            currentUser ? <img src={currentUser.avatar} alt="" className='rounded-full border border-slate-300 h-7 w-7 object-cover' /> : <li className={`text-slate-200 ${location.pathname === '/sign-in' || location.pathname === '/sign-up' ? 'text-slate-100' : 'text-slate-300'}  hover:underline`}>Sign in</li>
                        }

                    </Link>
                </ul>
            </div>
        </header>
    )
}

export default Header