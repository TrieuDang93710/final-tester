const Payment = require('../models/payment');
const Cart = require('../models/cart');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({createAt: -1});
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPaymentByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    // console.log(email);
    const query = { email: email };
    const result = await Payment.find(query).sort({ createAt: -1 }).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPayment = async (req, res) => {
  const payment = req.body;
  try {
    const paymentResponse = await Payment.create(payment);
    // delete cart item after payment
    const cartIds = payment.cartItems.map((id) => new ObjectId(id));
    const deleteCartResponse = await Cart.deleteMany({ _id: { $in: cartIds } });

    res.status(200).json({ paymentResponse, deleteCartResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makePaymentStatus = async (req, res) => {
  const paymentId = req.params.id;
  const { transitionId, email, price, quantity, status, itemName, cartItems, menuItems } = req.body;
  try {
    const updatedPaymentStatus = await Payment.findByIdAndUpdate(
      paymentId,
      { status: status },
      { new: true, runValidators: true }
    );
    if (!updatedPaymentStatus) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(updatedPaymentStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  createPayment,
  getPaymentByEmail,
  makePaymentStatus
};
