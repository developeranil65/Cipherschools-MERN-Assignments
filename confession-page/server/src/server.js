require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const authRoutes = require("./routes/authRoutes");
const confessionRoutes = require("./routes/confessionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true, // Allow cookies to be sent cross-origin
    })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Session middleware — stores auth state between requests
app.use(
    session({
        secret: process.env.SESSION_SECRET || "default-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// Initialize Passport and connect it to the session
configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req, res) => {
    res.json({
        message: "Confession Wall API is running",
        endpoints: {
            auth: "/auth/google",
            confessions: "/api/confessions",
        },
    });
});

// Authentication routes (Google OAuth)
app.use("/auth", authRoutes);

// Confession CRUD + reaction routes
app.use("/api/confessions", confessionRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
