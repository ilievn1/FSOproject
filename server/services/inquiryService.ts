import { NewInquiry } from '../types';
import { Inquiry } from '../models';

const addInquiry = async (body: NewInquiry) => {
  const newInquiry = await Inquiry.create(body);
  return newInquiry;
};

export default {
  addInquiry
};