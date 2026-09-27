import express from "express";
import dotenv from "dotenv"


// load environment variables
dotenv.config();

// initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());

// Routes

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: "Healthy",
        message: `API is running on ${PORT}`
    })
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});