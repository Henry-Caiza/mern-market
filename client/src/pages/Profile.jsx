import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from "../redux/user/userSlice"
import { Input } from "@nextui-org/react"

function Profile() {
    const { currentUser, loading, error } = useSelector((state) => state.user)
    const fileRef = useRef(null)
    const [file, setFile] = useState(undefined)
    const [filePerc, setFilePerc] = useState(0)
    const [fileUploadError, setFileUploadError] = useState(false)
    const [formData, setFormData] = useState({})
    const [updateSuccess, setUpdateSuccess] = useState(false)
    const [showListingsError, setShowListingsError] = useState(false)
    const [userListings, setUserListings] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        if (file) {
            handleFileUpload(file)
        }
    }, [file])
    const handleFileUpload = (file) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setFilePerc(Math.round(progress))
        },
            (error) => {
                setFileUploadError(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, avatar: downloadURL })
                })
            }
        )
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(updateUserFailure(data.message))
                return
            }
            dispatch(updateUserSuccess(data))
            setUpdateSuccess(true)
        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }
    const handleDeleteUser = async () => {
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            })
            const data = await res.json()
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
            }
            dispatch(deleteUserSuccess(data))

        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignout = async () => {
        try {
            dispatch(signOutUserStart())
            const res = await fetch('/api/auth/signout')
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message))
                return
            }
            dispatch(signOutUserSuccess(data))
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    }

    return (
        <main className="p-3 max-w-lg mx-auto">
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input onChange={(e) => {
                    setFile(e.target.files[0])
                    setFileUploadError(false)
                }}
                    type="file" ref={fileRef} hidden accept="image/*" />
                <img onClick={() => fileRef.current.click()} src={formData?.avatar || currentUser.avatar} alt="img profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-2 " />
                <p className="text-sm self-center">
                    {fileUploadError ? <span className="text-red-700">Error Image Upload (image must be less than 2mb)</span> : filePerc > 0 && filePerc < 100 ? <span className="text-slate-700">
                        {`Uploading ${filePerc}%`}
                    </span> :
                        filePerc === 100 ?
                            <span className="text-green-700">
                                Image successfully uploaded!
                            </span>
                            : ""
                    }
                </p>
                <Input isRequired type="text" id="username" label="Username" defaultValue={currentUser.username} onChange={handleChange} variant="bordered" />
                <Input isRequired type="email" id="email" label="Email" defaultValue={currentUser.email} onChange={handleChange} variant="bordered" />
                <Input type="password" id="password" label="Password" onChange={handleChange} variant="bordered" />
                <button disabled={loading} className="bg-slate-700 text-white rounded-full p-3 uppercase hover:opacity-95 disabled:opacity-80 transition">{loading ? 'Loading...' : 'Update'}</button>
            </form>
            <div className="flex justify-between mt-5">
                <span onClick={handleDeleteUser} className="border-2 border-red-700 py-2 px-4 rounded-full text-red-700 cursor-pointer hover:bg-red-700 hover:text-white transition flex items-center justify-center h-10">Delete account</span>
                <span className="text-white cursor-pointer bg-red-700 py-2 px-4 rounded-full hover:bg-transparent hover:text-red-700 border-2 border-red-700 transition flex items-center justify-center h-10" onClick={handleSignout}>Sign out</span>
            </div>
            <p className="text-red-700 mt-5">{error ? error : ''}</p>
            <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>
        </main>
    )
}

export default Profile