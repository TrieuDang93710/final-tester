const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

dotenv.config();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());
app.use(express.json());
app.use(morgan('common'));

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log('MongoDB connection successful'))
  .catch((err) => {
    console.log('error: ', err);
    console.log('Connection failed');
  });

// Listen

// jwt authentication
app.post('/jwt', async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr'
  });
  res.send({ token });
});

// import router
const menuRouter = require('./api/router/menuRouter');
const cartRouter = require('./api/router/cartRouter');
const userRouter = require('./api/router/userRouter');
const paymentRouter = require('./api/router/paymentRouter');

app.use('/menu', menuRouter);
app.use('/cart', cartRouter);
app.use('/user', userRouter);
app.use('/payment', paymentRouter);

// stripe cart payment
// Create a PaymentIntent with the order amount and currency
app.post('/create-payment-intent', async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    payment_method_types: ['card']
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running...${process.env.PORT}`);
});
