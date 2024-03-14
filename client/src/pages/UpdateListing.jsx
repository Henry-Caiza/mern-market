import { useEffect, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Input, Textarea } from "@nextui-org/react"
import { IoTrashBinOutline } from "react-icons/io5"

function UpdateListing() {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()
    const params = useParams()
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({ imageUrls: [], name: "", description: "", address: "", type: "rent", bedrooms: 1, bathrooms: 1, regularPrice: 50, discountPrice: 0, offer: false, parking: false, furnished: false })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId

            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json()

            if (data.success === false) {
                console.log(data.message);
                return
            }
            setFormData(data)
        }
        fetchListing()
    }, [])

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storageImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Image upload failed (2mb max per image)')
                setUploading(false)
            })
        } else {
            setImageUploadError('You can only upload 6 images for listing')
            setUploading(false)
        }
    }
    const storageImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                },
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (formData.imageUrls.length < 1) return setError('Please upload at least one image!')
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower  than regular price!')
            setLoading(true)
            setError(false)
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                })
            })
            const data = await res.json()
            setLoading(false)
            if (data.success === false) {
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }
    return (
        <main className="p-3 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Update Listing</h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <Input isRequired type="text" label="Name" variant="bordered" id="name" minLength='6' required onChange={handleChange} value={formData.name} />
                    <Textarea isRequired type="text" label="Description" variant="bordered" id="description" required onChange={handleChange} value={formData.description} />
                    <Input isRequired type="text" label="Address" variant="bordered" id="address" required onChange={handleChange} value={formData.address} />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id='sale' className="w-5" onChange={handleChange} checked={formData.type === 'sale'} />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' className="w-5" onChange={handleChange} checked={formData.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' className="w-5" onChange={handleChange} checked={formData.parking} />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' className="w-5" onChange={handleChange} checked={formData.furnished} />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className="w-5" onChange={handleChange} checked={formData.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <Input type="number" id="bedrooms" variant="bordered" min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input type="number" id="bathrooms" variant="bordered" min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input type="number" id="regularPrice" variant="bordered" required min='50' max='10000000' onChange={handleChange} value={formData.regularPrice} />
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                        {formData.offer && <div className="flex items-center gap-2">
                            <Input type="number" id="discountPrice" variant="bordered" required min='0' max='10000000' onChange={handleChange} value={formData.discountPrice} />
                            <div className="flex flex-col items-center">
                                <p>Discount Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>}

                    </div>

                </div>
                <div className="flex flex-col flex-1 gap-4">
                    <p className="font-semibold">Images:
                        <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span></p>
                    <div className="flex gap-4 items-center">
                        <input onChange={(e) => setFiles(e.target.files)} className="p-3 border-2 border-gray-200 rounded-xl w-full" type="file" id='images' accept='image/*' multiple />
                        <button disabled={uploading} type="button" onClick={handleImageSubmit} className="py-2 px-3 h-10 transition text-green-700 border-green-700 rounded-full uppercase hover:shadow-lg hover:bg-green-700 hover:text-white border disabled:opacity-80">{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between rounded-xl p-3 border-2 items-center">
                                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button type="button" onClick={() => handleRemoveImage(index)} className="p-2  text-red-700  uppercase hover:opacity-75 flex"> <IoTrashBinOutline className="h-6 w-6" /></button>
                            </div>
                        ))
                    }
                    <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-full transition uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Updating...' : 'Update Listing'}</button>
                    {
                        error && <p className="text-red-700 text-sm">{error}</p>
                    }
                </div>
            </form>
        </main>
    )
}

export default UpdateListing