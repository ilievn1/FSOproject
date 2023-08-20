const { Feedback } = require('../models');

interface Props {
    reservationId: number;
    rating: number;
    comment?: string;
}

const addFeedback = async (props: Props) => {
  const newFeedback = await Feedback.create(props);
  if ('id' in newFeedback.toJSON()) {
    return true;
  }
  return false;
};

export default {
  addFeedback
};