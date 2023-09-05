
import axios from 'axios'
import { Inquiry } from '../types';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/inquiries`

const sendInquiry = async (contactBody: Inquiry): Promise<Inquiry> => {
    const resp = await axios.post(baseUrl, contactBody);
    return resp.data
}
export default {
    sendInquiry
}