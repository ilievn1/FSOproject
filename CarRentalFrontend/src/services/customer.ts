import axios from 'axios'
import { Customer } from '../types'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/customers`

const getCustomer = async (): Promise<Customer> => {
    const resp = await axios.get(`${baseUrl}/current`, { withCredentials: true })
    return resp.data
}

// const create = newObject => {
//     const request = axios.post(baseUrl, newObject)
//     return request.then(response => response.data)
// }

// const update = (id, newObject) => {
//     const request = axios.put(`${baseUrl}/${id}`, newObject)
//     return request.then(response => response.data)
// }

export default {
    getCustomer
}