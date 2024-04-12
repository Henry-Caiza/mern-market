export const createListing = (formData, id) => fetch('/api/listing/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ...formData,
        userRef: id
    })
})
export const updateListing = (formData, idUSer, idListing) => fetch(`/api/listing/update/${idListing}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        ...formData,
        userRef: idUSer
    })
})