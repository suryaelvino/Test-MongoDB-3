"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route_1 = __importDefault(require("./route/route"));
const database_1 = require("./database/database");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use(route_1.default);
app.use((0, cors_1.default)());
const measurePerformanceMiddleware = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} ${responseTime}ms`);
    });
    next();
};
app.use(measurePerformanceMiddleware);
(0, database_1.connectToMongoDB)();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
