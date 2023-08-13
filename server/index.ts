const app = require('./app');
const { PORT } = require('./utils/config');
const db = require('./utils/db');

const start = async () => {
  await db.connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
