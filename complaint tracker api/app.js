import express from "express";
import logger from './middlewares/logger.middleware.js';
import complaintRoutes from './routes/complaint.routes.js';

const app = express();

app.use(logger);

app.use(express.json());

app.use('/complaints', complaintRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

export default app;
