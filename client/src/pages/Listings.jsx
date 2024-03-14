import { useEffect, useState } from "react"
import TableListings from "../components/TableListings"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


function Listings() {
    const { currentUser } = useSelector((state) => state.user)
    const [userListings, setUserListings] = useState([])
    const [showListingsError, setShowListingsError] = useState(false)

    useEffect(() => {
        const showListings = async () => {
            try {
                setShowListingsError(false)
                const res = await fetch(`/api/user/listings/${currentUser._id}`)
                const data = await res.json()
                if (data.success === false) {
                    setShowListingsError(true)
                    return
                }
                setUserListings(data)
            } catch (error) {
                setShowListingsError(true)
            }
        }
        showListings()
    }, [])

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success === false) {
                console.log(data.message)
                return
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <main>
            <div className='px-3 max-w-6xl mx-auto gap-6 p-12 md:px-20 md:py-12'>
                <div className="flex items-center justify-between mb-2">
                    <h1 className='text-3xl font-bold mb-4 text-slate-800'>My Listings</h1>
                    <Link className="border-2 border-green-700 text-green-700 h-10 py-2 px-3 flex items-center rounded-full uppercase text-center hover:bg-green-700 hover:text-white transition" to='/create-listing'>
                        Create Listing
                    </Link>
                </div>
                <p className="text-red-700 mt-5">{showListingsError ? 'Error showing listings' : ''}</p>

                {
                    userListings.length > 0 ? <TableListings userListings={userListings} handleListingDelete={handleListingDelete} /> : <p>You dont have any listing yet</p>
                }

            </div>
        </main>
    )
}

export default Listings