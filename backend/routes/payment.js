const express = require('express');
const { stkPush, stkPushQuery, transactionStatusQuery } = require('../mpesa');
const Ride = require('../models/Ride');

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

// Query M-Pesa STK Push status
router.post('/mpesa-query', async (req, res) => {
    const { checkoutRequestId } = req.body;
    if (!checkoutRequestId) {
        return res.status(400).json({ message: 'CheckoutRequestId is required' });
    }
    try {
        const response = await stkPushQuery(checkoutRequestId);
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'M-Pesa query error', err });
    }
});

// Query M-Pesa transaction status
router.post('/mpesa-transaction-status', async (req, res) => {
    const { transactionId } = req.body;
    if (!transactionId) {
        return res.status(400).json({ message: 'TransactionId is required' });
    }
    try {
        const response = await transactionStatusQuery(transactionId);
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'M-Pesa transaction status error', err });
    }
});

// M-Pesa STK Push callback
router.post('/callback', async (req, res) => {
    const { Body } = req.body;

    if (Body && Body.stkCallback) {
        const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

        try {
            if (ResultCode === 0 && CallbackMetadata) {
                // Payment successful
                const receiptNumber = CallbackMetadata.Item.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
                const amount = CallbackMetadata.Item.find(item => item.Name === 'Amount')?.Value;
                const phone = CallbackMetadata.Item.find(item => item.Name === 'PhoneNumber')?.Value;

                console.log('Payment successful:', { MerchantRequestID, CheckoutRequestID, receiptNumber, amount, phone });

                // Find and update the ride
                const ride = await Ride.findOneAndUpdate(
                    { mpesaCheckoutRequestId: CheckoutRequestID },
                    {
                        paymentStatus: 'paid',
                        mpesaReceipt: receiptNumber
                    },
                    { new: true }
                );

                if (ride) {
                    console.log('Ride payment updated:', ride._id);
                } else {
                    console.log('Ride not found for CheckoutRequestID:', CheckoutRequestID);
                }
            } else {
                // Payment failed - update ride status to failed
                await Ride.findOneAndUpdate(
                    { mpesaCheckoutRequestId: CheckoutRequestID },
                    { paymentStatus: 'failed' }
                );
                console.log('Payment failed:', { MerchantRequestID, CheckoutRequestID, ResultDesc });
            }
        } catch (error) {
            console.error('Error processing M-Pesa callback:', error);
        }
    }

    // Always respond with success to M-Pesa
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
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
