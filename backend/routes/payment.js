const express = require('express');
const { stkPush, stkPushQuery, transactionStatusQuery, accountBalance } = require('../mpesa');
const Ride = require('../models/Ride');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Start M-Pesa payment for a ride
router.post('/mpesa', verifyToken, async (req, res) => {
    const { phone, amount, rideId } = req.body;
    if (!phone || !amount || !rideId) {
        return res.status(400).json({ message: 'Phone, amount, and rideId are required' });
    }

    try {
        // Verify the ride belongs to the user
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.passenger.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to pay for this ride' });
        }

        if (ride.paymentStatus === 'paid') {
            return res.status(400).json({ message: 'Ride already paid' });
        }

        const response = await stkPush(phone, amount, rideId);

        // Store the CheckoutRequestID in the ride
        if (response.CheckoutRequestID) {
            await Ride.findByIdAndUpdate(rideId, { mpesaCheckoutRequestId: response.CheckoutRequestID });
        }

        res.json({
            message: 'M-Pesa payment initiated',
            response,
            rideId
        });
    } catch (err) {
        console.error('M-Pesa payment error:', err);
        res.status(500).json({ message: 'M-Pesa payment failed', error: err.message });
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

// Query M-Pesa account balance
router.get('/mpesa-account-balance', async (req, res) => {
    try {
        const response = await accountBalance();
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'M-Pesa account balance error', err });
    }
});

// Get payment status for a ride
router.get('/ride/:rideId', verifyToken, async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Check if user is authorized to view this payment
        if (ride.passenger.toString() !== req.user.id && ride.driver?.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json({
            rideId: ride._id,
            paymentStatus: ride.paymentStatus,
            mpesaReceipt: ride.mpesaReceipt,
            fare: ride.fare,
            checkoutRequestId: ride.mpesaCheckoutRequestId
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ message: 'Error fetching payment status' });
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
                    // Optionally notify the driver/passenger about successful payment
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

// Stripe payment endpoint
router.post('/card', async (req, res) => {
    const { amount, paymentMethodId } = req.body;
    
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' });
    }
    
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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

module.exports = router;
