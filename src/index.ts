import express, { NextFunction, Request, Response } from 'express';
import { connectToMongoDB } from './database/database';
import router from './route/route';
import cors from 'cors';
import logger from './logging/winston';
import cluster from 'cluster';
import os from 'os';

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
        const ip = req.ip;
        console.log(ip);
        const logMessage = `[${req.method}] ${res.statusCode} - ${req.path} - ${responseTimeInMilliseconds}ms - User-Agent: ${userAgent}`;
        console.log(logMessage);
        logger.info(logMessage);
    });

    next();
};

// Middleware dan pengaturan lainnya
app.set('trust proxy', true);
app.use(express.json());
app.use(measurePerformanceMiddleware);
app.use(router);
app.use(cors());

// Mulai server
if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    // const numCPUs = 2;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    connectToMongoDB();
    app.listen(PORT, () => {
        return console.log(`Server is running on http://localhost:${PORT}`);
    });
}

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
