const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const { errorResponse } = require('./utils/response');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use('/api', userRoutes);

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Something went wrong';
//   res.status(statusCode).json(errorResponse(message, statusCode));
// });

// const PORT = process.env.PORT || 5000;
// const options = {
//   key: fs.readFileSync('/path/to/private/key.pem'),
//   cert: fs.readFileSync('/path/to/certificate.pem')
// };

// https.createServer(options, app).listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });



// your middleware and route handlers

app.listen(80, () => {
  console.log('Server running at http://www.api.critistudio.top/');
});
app.use('/api', userRoutes);