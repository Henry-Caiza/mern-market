export const updateUser = (id, formData) => fetch(`/api/user/update/${id}`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
})

export const deleteUser = (id) => fetch(`/api/user/delete/${id}`, {
    method: 'DELETE',
})