backend/
├── config/
│   └── db.js                  # MongoDB connection logic (mongoose.connect)
├── controllers/
│   ├── authController.js      # Logic for register, login, and token generation
│   ├── equipmentController.js # CRUD logic for creating and searching equipment
│   ├── bookingController.js   # The complex logic for date overlaps and status updates
│   └── reviewController.js    # Logic for leaving and fetching ratings
├── middlewares/
│   ├── authMiddleware.js      # Verifies JWTs to protect private routes
│   ├── errorMiddleware.js     # Global error handler (catches all API errors gracefully)
│   └── uploadMiddleware.js    # Multer configuration for handling tractor/profile images
├── models/
│   ├── User.js                # (The schemas we just created)
│   ├── Equipment.js           
│   ├── Booking.js             
│   └── Review.js              
├── routes/
│   ├── authRoutes.js          # Maps POST /api/auth/login -> authController.login
│   ├── equipmentRoutes.js     # Maps GET /api/equipment -> equipmentController.getAll
│   ├── bookingRoutes.js       # Maps POST /api/bookings -> bookingController.create
│   └── reviewRoutes.js        
├── utils/
│   ├── catchAsync.js          # A helper to avoid writing try/catch blocks in every controller
│   ├── dateHelper.js          # Reusable math for calculating total rental days/costs
│   └── sendEmail.js           # Nodemailer setup for sending booking confirmations
├── .env                       # Secret keys (MongoDB URI, JWT Secret, Stripe Keys)
├── .gitignore                 # Tells Git to ignore node_modules and your .env file
├── package.json               # Tracks your dependencies (express, mongoose, bcryptjs)
└── server.js                  # The entry point that stitches everything together and starts the app