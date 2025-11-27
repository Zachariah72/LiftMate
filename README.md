# LiftMate

LiftMate is a comprehensive ride-sharing application designed to connect passengers with drivers in real-time. Built with modern web technologies, it provides a seamless experience for booking rides, tracking drivers, and managing ride history.

## 🚀 Features

### For Passengers
- **Real-time Ride Booking**: Request rides with pickup and dropoff locations
- **Live Map Tracking**: Track driver location in real-time during rides
- **Ride History**: View past rides and ratings
- **Secure Payments**: Integrated M-Pesa payment system
- **User Authentication**: Secure login and registration system

### For Drivers
- **Driver Dashboard**: Comprehensive dashboard with real-time stats
- **Ride Management**: Accept/reject ride requests, mark arrivals, complete rides
- **Earnings Tracking**: Monitor daily, weekly, monthly, and yearly earnings
- **Availability Management**: Set availability status
- **Ride Statistics**: Detailed analytics on completed rides

### Core Features
- **Real-time Communication**: Live updates for ride status
- **Location Services**: GPS-based pickup and dropoff tracking
- **Payment Integration**: M-Pesa STK Push for secure payments
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Authentication & Authorization**: JWT-based secure authentication

## 🛠️ Tech Stack

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Material-UI (MUI)**: React components implementing Google's Material Design
- **Axios**: HTTP client for API requests
- **React Router**: Declarative routing for React
- **Leaflet**: Interactive maps for location services

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing

### Payment Integration
- **M-Pesa API**: Mobile money payment system for Kenya

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Zachariah72/LiftMate.git
cd LiftMate
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/liftmate
JWT_SECRET=your_jwt_secret_here

# M-Pesa Configuration
MPESA_SHORTCODE=your_shortcode
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_ENV=sandbox

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_key
```

Start the backend server:
```bash
npm run dev  # For development with nodemon
# or
npm start    # For production
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🚀 Deployment

### Quick Start: Production Deployment

**Deploy your LiftMate app to production with these guides:**

1. **📖 [Complete Vercel + Render Integration Guide](backend/VERCEL_RENDER_INTEGRATION.md)** - Full-stack deployment
2. **🔧 [Render Backend Deployment](backend/RENDER_DEPLOYMENT.md)** - Backend-only deployment guide
3. **🌐 [Frontend Vercel Deployment](frontend/VERCEL_DEPLOYMENT.md)** - Frontend deployment guide

### Recommended Architecture:
- **Frontend**: Vercel (React/Vite app)
- **Backend**: Render (Node.js/Express API)
- **Database**: MongoDB Atlas
- **Payments**: M-Pesa + Stripe

### Environment Setup:
- **Frontend** (Vercel): Copy [`frontend/.env.example`](frontend/.env.example) → `.env`
- **Backend** (Render): Copy [`backend/.env.example`](backend/.env.example) → Configure in Render dashboard

**Production URLs will be:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com/api`

## 📖 Usage

### For Passengers
1. **Register/Login**: Create an account or log in
2. **Book a Ride**: Enter pickup and dropoff locations
3. **Track Driver**: Monitor driver location on the live map
4. **Make Payment**: Complete payment via M-Pesa
5. **Rate Ride**: Provide feedback after ride completion

### For Drivers
1. **Register as Driver**: Sign up with driver-specific information
2. **Set Availability**: Mark yourself as available for rides
3. **Accept Rides**: View and accept ride requests
4. **Navigate**: Use the map to reach pickup locations
5. **Complete Rides**: Mark rides as completed and collect earnings
6. **View Stats**: Monitor performance and earnings on the dashboard

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Rides
- `GET /api/rides` - Get user's rides
- `POST /api/rides/create` - Create ride request
- `GET /api/rides/available/for-drivers` - Get available rides for drivers
- `POST /api/rides/accept/:id` - Accept ride (driver)
- `POST /api/rides/complete/:id` - Complete ride
- `GET /api/rides/driver-stats` - Get driver statistics

### Payments
- `POST /api/rides/pay` - Initiate M-Pesa payment

## 🏗️ Project Structure

```
LiftMate/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📞 Support

For support, email support@liftmate.com or join our Discord community.

## 🙏 Acknowledgments

- Material-UI for the beautiful component library
- Leaflet for mapping capabilities
- M-Pesa for payment integration
- The open-source community for inspiration and tools

---

**LiftMate** - Connecting riders with drivers, one ride at a time. 🚗💨