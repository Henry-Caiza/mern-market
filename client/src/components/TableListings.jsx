
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Image, Tooltip } from "@nextui-org/react"

import { IoEyeOutline, IoTrashBinOutline } from "react-icons/io5"
import { FiEdit3 } from "react-icons/fi"
import { useCallback } from "react"
import { Link } from "react-router-dom"

const columns = [
    { name: "IMAGE", uid: "image" },
    { name: "NAME", uid: "name" },
    { name: "ACTIONS", uid: "actions" },
]



function TableListings({ userListings, handleListingDelete }) {
    const renderCell = useCallback((listing, columnKey) => {
        const cellValue = listing[columnKey];

        switch (columnKey) {
            case "image":
                return (
                    <Link className="" to={`/listing/${listing._id}`}>
                        <Image
                            width={100}
                            alt="listing cover"
                            src={listing.imageUrls[0]}
                            isZoomed
                            classNames={
                                { img: 'h-16' }
                            }
                        />
                    </Link>
                )
            case "name":
                return (
                    <Link className="flex-1 text-slate-700 font-semiboldhover:underline truncate" to={`/listing/${listing._id}`}>
                        <p className="">{listing.name}</p>
                    </Link>
                )
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <Link className="" to={`/listing/${listing._id}`}>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <IoEyeOutline />
                                </span>
                            </Link>
                        </Tooltip>
                        <Tooltip content="Edit listing">
                            <Link to={`/update-listing/${listing._id}`}>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <FiEdit3 />
                                </span>
                            </Link>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete listing">
                            <span onClick={() => handleListingDelete(listing._id)} className="text-lg text-danger cursor-pointer active:opacity-50">
                                <IoTrashBinOutline />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    return (
        <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={userListings}>
                {(item) => (
                    <TableRow key={item._id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}

export default TableListings