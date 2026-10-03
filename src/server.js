import express from "express";
import dotenv from "dotenv";

import monitorRoutes from "./routes/monitor.routes.js";
import summaryRoutes from "./routes/summary.routes.js";


// Load environment variables
dotenv.config();


// Initialize Express app
const app = express();

const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.json());


// Health check route
app.get("/health", (req, res) => {
    res.json({
        status: "Healthy",
        message: `API is running on ${PORT}`
    });
});


// Monitor routes
app.use("/monitors", monitorRoutes);


// Summary routes
app.use("/summary", summaryRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});