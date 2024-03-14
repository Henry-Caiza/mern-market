import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'
import { createArrImagesHome } from '../utils/helpers'

import "react-image-gallery/styles/css/image-gallery.css";
import ReactImageGallery from 'react-image-gallery'

function Home() {
    const [offerListings, setOfferListings] = useState([])
    const [saleListings, setSaleListings] = useState([])
    const [rentListings, setRentListings] = useState([])
    let images = []

    useEffect(() => {
        const fetchOfferListings = async () => {
            try {
                const res = await fetch('/api/listing/get?offer=true&limit=4')
                const data = await res.json()
                setOfferListings(data)
                fetchRentListings()
            } catch (error) {
                console.log(error)
            }
        }
        const fetchRentListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=rent&limit=4')
                const data = await res.json()
                setRentListings(data)
                fetchSaleListings()
            } catch (error) {
                console.log(error)
            }
        }

        const fetchSaleListings = async () => {
            try {
                const res = await fetch('/api/listing/get?type=sale&limit=4')
                const data = await res.json()
                setSaleListings(data)
            } catch (error) {
                log(error)
            }
        };
        fetchOfferListings()
    }, []);

    try {
        images = createArrImagesHome(offerListings)
    } catch (error) {
        console.log(error)
    }
    return (
        <main>
            <div className=' bg-gradient-to-b from-transparent from-40% to-primary/30'>
                <div className='flex flex-col gap-6 p-12 md:p-28 px-3 max-w-6xl mx-auto'>
                    <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl '>
                        Discover your next <span className='text-slate-500'>perfect</span>
                        <br />
                        place effortlessly.
                    </h1>
                    <div className='text-gray-400 text-xs sm:text-sm'>
                        CozySoS offers the finest selection of homes for your ideal living space.
                        <br />
                        With a diverse array of properties, finding your perfect match has never been easier.
                    </div>
                    <Link
                        to={'/search'}
                        className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
                    >
                        Let's get started
                    </Link>
                </div>
            </div>
            <div>
                <ReactImageGallery items={images} showPlayButton={false}
                    showFullscreenButton={false}
                    showThumbnails={true}
                    showBullets={false}
                    showNav={true}
                    autoPlay={true}

                    slideInterval={7000}
                    slideDuration={1000} />
            </div>
            <div className='bg-gradient-to-b from-transparent from-40% to-primary/30'>
                <div className='max-w-6xl mx-auto p-5 flex flex-col gap-8 sm:mt-10'>
                    {offerListings && offerListings.length > 0 && (
                        <div className=''>
                            <div className='my-3'>
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4'>
                                {offerListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )}
                    {rentListings && rentListings.length > 0 && (
                        <div className=''>
                            <div className='my-3'>
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4'>
                                {rentListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )}
                    {saleListings && saleListings.length > 0 && (
                        <div className=''>
                            <div className='my-3'>
                                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
                            </div>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4'>
                                {saleListings.map((listing) => (
                                    <ListingItem listing={listing} key={listing._id} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </main>
    )
}

export default Home