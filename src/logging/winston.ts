import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const logDirectory = path.join(__dirname, 'logs');
const { format } = winston;

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json()
    ),
    transports: [
        new DailyRotateFile({
            filename: path.join(logDirectory, 'application-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30'
        })
    ]
});

// Hapus atau komentar bagian ini jika Anda tidak menggunakan log console
// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple()
//     }));
// }

// Hapus atau komentar bagian ini jika Anda tidak memerlukan penghapusan file
setInterval(() => {
    const files = fs.readdirSync(logDirectory);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    files.forEach(file => {
        const filePath = path.join(logDirectory, file);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isFile() && fileStat.mtime < thirtyDaysAgo) {
            fs.unlinkSync(filePath);
        }
    });
}, 24 * 60 * 60 * 1000);

export default logger;
