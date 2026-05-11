import './config/env.js';

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Capzyy server running on port ${PORT} [${process.env.NODE_ENV}]`
    );
  });
});