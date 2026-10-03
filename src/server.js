import express, { response } from "express";
import dotenv from "dotenv"


// load environment variables
dotenv.config();

// initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
const monitors = [];
let nextId = 1;
// Routes

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: "Healthy",
        message: `API is running on ${PORT}`
    })
});

app.post('/monitors', (req, res) => {
    const { name, url } = req.body;
    if (!name || !url) {
        return res.status(400).json({
            message: "Name and url are required"
        })
    }
    const monitor = {
        id: nextId++,
        name,
        url,
        status: 'pending',
    }
    monitors.push(monitor);
    res.status(201).json(monitor);
})

app.post('/monitors/:id/check', async (req, res) => {
    const id = Number(req.params.id);
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) {
        return res.status(404).json({ message: 'Not found' });
    }
    const startTime = Date.now();
    try {

        const response = await fetch(monitor.url);
        const endTime = Date.now();

        monitor.status = response.ok ? "UP" : "DOWN";
        monitor.lastCheck = {
            statusCode: response.status,
            responseTime: endTime - startTime,
            checkedAt: new Date().toISOString(),
        }
    } catch (err) {
        monitor.status = "DOWN";
        monitor.lastCheck = {
            statusCode: null,
            error: err.code || 'ERROR',
            responseTime: Date.now() - startTime,
            checkedAt: new Date().toISOString(),
        };
    }
    res.json(monitor);
})
app.get('/monitors', (req, res) => {
    res.json(monitors);
});

app.get('/monitors/:id', (req, res) => {
    const id = Number(req.params.id);
    const monitor = monitors.find(m => m.id === id);
    if (!monitor) {
        return res.status(404).json({
            message: "Monitor not found"
        })
    }
    res.json(monitor);
});

app.delete('/monitors/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = monitors.findIndex(m => m.id === id);
    if (index === -1) {
        return res.status(404).json({
            message: "Monitor not found"
        })
    }
    const deletedMonitor = monitors.splice(index, 1)[0];
    res.json(deletedMonitor);
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

