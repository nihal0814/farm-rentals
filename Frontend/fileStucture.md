src/
├── assets/            # Static files (images, icons)
├── components/        # Reusable UI components
│   ├── layout/        # Navbar, Footer, Sidebar
│   ├── equipment/     # EquipmentCard, EquipmentList
│   └── ui/            # Buttons, Modals, Spinners, DatePicker
├── pages/             # Route-level components
│   ├── Home.jsx       # Landing page with search bar
│   ├── Search.jsx     # Filtered list of equipment
│   ├── Details.jsx    # Single equipment view with booking calendar
│   ├── Dashboard.jsx  # User's active rentals and owned equipment listings
│   └── Auth.jsx       # Login/Register
├── hooks/             # Custom React hooks (e.g., useAuth, useGeolocation)
├── context/           # React Context API (e.g., AuthContext)
├── services/          # API call logic (Axios/Fetch functions)
│   ├── api.js         # Base axios configuration
│   ├── equipment.js   # fetchEquipment(), createEquipment()
│   └── booking.js     # requestBooking(), cancelBooking()
├── utils/             # Helper functions (date formatting, price calculation)
├── App.jsx            # Main router configuration
└── index.jsx          # Entry point