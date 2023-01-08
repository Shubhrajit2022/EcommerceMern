const express = require('express');

const app = express();

const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const fileUpload = require('express-fileupload')

const errorMiddleware = require('./middleware/error')
//  global.logger = require('logger').createLogger('development.log');

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

//route imports
const product = require("./routes/productRoutes");
const user = require('./routes/userRoutes')
const order = require('./routes/orderRoute')
app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order)

//midddleware for error

app.use(errorMiddleware);


module.exports = app;