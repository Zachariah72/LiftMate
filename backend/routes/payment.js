const express = require('express');
const { stkPush } = require('../mpesa');

const router = express.Router();

// Start M-Pesa payment
router.post('/mpesa', async (req, res) => {
    const { phone, amount } = req.body;
    try {
        const response = await stkPush(phone, amount);
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'M-Pesa payment error', err });
    }
});

module.exports = router;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/card', async (req, res) => {
    const { amount, paymentMethodId } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // convert to cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });
        res.json(paymentIntent);
    } catch (err) {
        res.status(500).json({ message: 'Card payment error', err });
    }
});
