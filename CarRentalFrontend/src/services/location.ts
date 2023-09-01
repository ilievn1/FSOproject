import axios from 'axios'
import { Location } from '../types';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/locations`


const getAll = async (): Promise<Location[]> => {
    const resp = await axios.get(baseUrl)
    return resp.data
}
export default {
    getAll
}