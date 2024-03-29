const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const articleRoutes = require('./routes/articleRoutes');
const managerRoutes = require('./routes/managerRoutes');
const log = require('./utils/log');


var cookieParser = require('cookie-parser')

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use("/uploads", express.static('uploads'));
app.use('/', function (req, res, next) {
  log.writeRequest(req)
  next();
})

app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/menu/article', articleRoutes);
app.use('/api/manager', managerRoutes);




app.listen(5000, () => {
  console.log('Server running at http://www.api.sinovietlogistics.vn/');
});