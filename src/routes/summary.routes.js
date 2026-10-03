import express from "express";

import {
    getSummary
} from "../services/monitor.service.js";

const router = express.Router();


// GET /summary
router.get("/", (req, res) => {
    const summary = getSummary();

    res.json(summary);
});


export default router;