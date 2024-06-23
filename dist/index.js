"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database/database");
const route_1 = __importDefault(require("./route/route"));
const cors_1 = __importDefault(require("cors"));
const winston_1 = __importDefault(require("./logging/winston"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware untuk mengukur performa
const measurePerformanceMiddleware = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        const responseTimeInMilliseconds = endTime - startTime;
        // Ambil User-Agent dari header permintaan
        const userAgent = req.headers['user-agent'] || 'Unknown';
        const logMessage = `[${req.method}] ${res.statusCode} - ${req.path} - ${responseTimeInMilliseconds}ms - User-Agent: ${userAgent}`;
        console.log(logMessage);
        winston_1.default.info(logMessage);
    });
    next();
};
// Middleware dan pengaturan lainnya
app.set('trust proxy', true);
app.use(express_1.default.json());
app.use(measurePerformanceMiddleware);
app.use(route_1.default); // Mount router
app.use((0, cors_1.default)());
// Koneksi ke MongoDB
(0, database_1.connectToMongoDB)();
// Mulai server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
