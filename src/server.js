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
        return res.status(404).json({
            message: 'Monitor not found'
        });
    }

    const startTime = Date.now();
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 5000);

    try {
        const response = await fetch(monitor.url, {
            signal: controller.signal
        });

        const responseTime = Date.now() - startTime;

        monitor.status = response.ok ? "UP" : "DOWN";

        const checkResult = {
            status: monitor.status,
            statusCode: response.status,
            responseTime,
            checkedAt: new Date().toISOString()
        };

        monitor.lastCheck = checkResult;
        monitor.history.push(checkResult);

        res.json(monitor);

    } catch (err) {

        monitor.status = "DOWN";

        const checkResult = {
            status: "DOWN",
            statusCode: null,
            error: err.name === "AbortError"
                ? "Request timed out"
                : err.message,
            responseTime: Date.now() - startTime,
            checkedAt: new Date().toISOString()
        };

        monitor.lastCheck = checkResult;
        monitor.history.push(checkResult);

        res.json(monitor);

    } finally {
        clearTimeout(timeoutId);
    }
});

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

app.get('/summary', (req, res) => {
    const total = monitors.length;
    const up = monitors.filter(m => m.status === 'UP').length;
    const down = monitors.filter(m => m.status === 'DOWN').length;
    const unknown = monitors.filter(m => m.status === 'pending').length;
    res.json({ total, up, down, unknown });
})


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

