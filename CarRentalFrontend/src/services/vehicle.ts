import axios from 'axios'
import { Vehicle } from '../types';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/vehicles`


const getAll = async(): Promise<Vehicle[]> => {
    const resp = await axios.get(baseUrl)
    return resp.data
}

const vehicleNonAvailableDates = async (brand: string, model: string, year: number | string)=> {
    const resp = await axios.get(`${baseUrl}?brand=${brand}&model=${model}&year=${year}`);
    return resp.data
}
const getTopThreeVehicles = async (): Promise<Vehicle[]> => {
    const resp = await axios.get(`${baseUrl}?top=3`);
    return resp.data
}

export default {
    getAll, vehicleNonAvailableDates, getTopThreeVehicles
}