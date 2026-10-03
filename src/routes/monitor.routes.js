import express from "express";

import {
    createMonitor,
    getAllMonitors,
    getMonitorById,
    deleteMonitor,
    checkMonitor
} from "../services/monitor.service.js";

const router = express.Router();


// POST /monitors
router.post("/", (req, res) => {
    const { name, url } = req.body;

    if (!name || !url) {
        return res.status(400).json({
            message: "Name and url are required"
        });
    }

    const monitor = createMonitor(name, url);

    res.status(201).json(monitor);
});


// GET /monitors
router.get("/", (req, res) => {
    const monitors = getAllMonitors();

    res.json(monitors);
});


// GET /monitors/:id
router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const monitor = getMonitorById(id);

    if (!monitor) {
        return res.status(404).json({
            message: "Monitor not found"
        });
    }

    res.json(monitor);
});


// DELETE /monitors/:id
router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    const deletedMonitor = deleteMonitor(id);

    if (!deletedMonitor) {
        return res.status(404).json({
            message: "Monitor not found"
        });
    }

    res.json(deletedMonitor);
});


// POST /monitors/:id/check
router.post("/:id/check", async (req, res) => {
    const id = Number(req.params.id);

    const monitor = await checkMonitor(id);

    if (!monitor) {
        return res.status(404).json({
            message: "Monitor not found"
        });
    }

    res.json(monitor);
});


export default router;