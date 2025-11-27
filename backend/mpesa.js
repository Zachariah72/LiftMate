// backend/mpesa.js
const axios = require('axios');

const {
  MPESA_SHORTCODE,
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_PASSKEY,
  MPESA_ENV = 'sandbox', // default to sandbox if not set
  MPESA_CALLBACK_URL = 'http://localhost:5000/api/payment/callback'
} = process.env;

// Get OAuth access token
async function getAccessToken() {
  const url =
    MPESA_ENV === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
      : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const { data } = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
  return data.access_token;
}

// Trigger STK Push payment
async function stkPush(phone, amount, rideId) {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  const url =
    MPESA_ENV === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
      : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: `LiftMateRide-${rideId}`,
    TransactionDesc: 'Payment for ride'
  };

  const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
}

// Query STK Push payment status
async function stkPushQuery(checkoutRequestId) {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  const url =
    MPESA_ENV === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query'
      : 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query';

  const payload = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId
  };

  const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
}

// Query transaction status
async function transactionStatusQuery(transactionId) {
  const token = await getAccessToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14); // YYYYMMDDHHMMSS
  const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

  const url =
    MPESA_ENV === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query'
      : 'https://api.safaricom.co.ke/mpesa/transactionstatus/v1/query';

  const payload = {
    Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
    SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL || 'test',
    CommandID: 'TransactionStatusQuery',
    TransactionID: transactionId,
    PartyA: MPESA_SHORTCODE,
    IdentifierType: '4',
    ResultURL: MPESA_CALLBACK_URL,
    QueueTimeOutURL: MPESA_CALLBACK_URL,
    Remarks: 'Transaction status check',
    Occasion: 'LiftMate'
  };

  const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
}

module.exports = { stkPush, stkPushQuery, transactionStatusQuery };
