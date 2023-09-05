import axios from 'axios'
import { Customer } from '../types'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/customers`

const getCustomer = async (): Promise<Customer> => {
    const resp = await axios.get(`${baseUrl}/current`, { withCredentials: true })
    return resp.data
}

export default {
    getCustomer
}