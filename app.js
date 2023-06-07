const express = require('express');
const routes = require('./routes/routes');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/connectDB');

const cookieParser = require('cookie-parser');

// .ENV
require('dotenv').config();

const app = express();

// Template
app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/admin')]);
app.use(express.static('public'));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CROS - Cho phép truy cập từ các domain khác như sau
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// Cookie Parser
app.use(cookieParser());

// Test Connect DB
connectDB();

// routes
app.use('/', routes);

// error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
