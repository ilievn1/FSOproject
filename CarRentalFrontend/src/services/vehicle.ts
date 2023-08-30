import axios from 'axios'
import { Vehicle } from '../types';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/vehicles`


const getAll = async(): Promise<Vehicle[]> => {
    const resp = await axios.get(baseUrl)
    return resp.data
}

const getRentVehicle = async (brand: string, model: string, year: number | string): Promise<Vehicle | undefined> => {
    const resp = await axios.get(`${baseUrl}?brand=${brand}&model=${model}&year=${year}`, { withCredentials: true });
    if (resp.status === 404) {
        return undefined
    }
    return resp.data
}
const getTopThreeVehicles = async (): Promise<Vehicle[]> => {
    const resp = await axios.get(`${baseUrl}?top=3`, { withCredentials: true });
    return resp.data
}

export default {
    getAll, getRentVehicle, getTopThreeVehicles
}