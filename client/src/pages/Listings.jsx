import { useEffect, useState } from "react"
import TableListings from "../components/TableListings"
import { useSelector } from "react-redux"


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
            <div className='py-20 px-3 max-w-6xl mx-auto gap-6 p-12 md:px-20 md:py-12'>
                <h1 className='text-3xl font-bold mb-4 text-slate-800'>My Listings</h1>
                <TableListings userListings={userListings} handleListingDelete={handleListingDelete} />
            </div>
        </main>
    )
}

export default Listings