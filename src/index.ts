import express, { NextFunction, Request, Response } from 'express';
import { connectToMongoDB } from './database/database';
import router from './route/route';
import cors from 'cors';
import logger from './logging/winston';
const app = express();
const PORT = 3000;



// Middleware untuk mengukur performa
const measurePerformanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const endTime = Date.now();
        const responseTimeInMilliseconds = endTime - startTime;
        
        // Ambil User-Agent dari header permintaan
        const userAgent = req.headers['user-agent'] || 'Unknown';

        // Periksa dan pastikan res.statusCode dan res.statusMessage terdefinisi
        const logMessage = `[${req.method}] ${res.statusCode} - ${req.path} - ${responseTimeInMilliseconds}ms - User-Agent: ${userAgent}`;
        console.log(logMessage);
        logger.info(logMessage);
    });

    next();
};

// Middleware dan pengaturan lainnya
app.use(express.json());
app.use(measurePerformanceMiddleware);
app.use(router); // Mount router
app.use(cors());

// Koneksi ke MongoDB
connectToMongoDB();

// Mulai server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
