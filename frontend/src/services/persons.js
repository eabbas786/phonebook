import axios from 'axios'


// const baseUrl = import.meta.env.VITE_API_URL
// console.log("Calling API:", import.meta.env.VITE_API_URL);
const baseUrl = '/api/persons'


const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const replace = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, create, remove, replace }