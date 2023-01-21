require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const LoginRouter = require('./routes/LoginRoutes')
const Products = require('./routes/Products')
const User = require('./routes/user')
const Order = require('./routes/order')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB config
const db = require("./config/key").mongoURI;
//connect DB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

// app.use((req, res, next) => {
//   req.baseUrl = `/api`;
//   next();
// });

app.use('/api', (req, res, next) => {
    next();
});

app.get("/", async (req, res) => {
  res.send("hi")
})

//checkAuth middleware
const checkAuth = require("./middlewares/checkAuth");

//Routes
app.use('/', LoginRouter);
app.use('/user', User);
app.use('/products', Products);
app.use('/orders',checkAuth, Order);

// app.use('/api', app);

const port = process.env.PORT || 5001

app.listen(port, () => console.log(`Server running at port ${port}`));
