"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const taskModel_1 = __importDefault(require("../model/taskModel"));
const projectModel_1 = __importDefault(require("../model/projectModel"));
// Fungsi yang akan dijalankan oleh worker
const processTask = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // workerData adalah data yang diterima dari thread utama
        const { projectId, title, description, startTime, endTime } = worker_threads_1.workerData;
        // Konversi waktu ke objek Date
        const startTimeDate = new Date(startTime);
        const endTimeDate = new Date(endTime);
        // Cari proyek berdasarkan ID
        const project = yield projectModel_1.default.findById(projectId);
        if (!project) {
            throw new Error(`Project with ID ${projectId} not found`);
        }
        // Validasi: pastikan tidak ada tugas yang saling tumpang tindih dalam waktu
        const existingTasks = yield taskModel_1.default.find({ projectId });
        for (const existingTask of existingTasks) {
            if (doTasksOverlap(existingTask.startTime, existingTask.endTime, startTimeDate, endTimeDate)) {
                throw new Error(`Task overlaps with existing task: ${existingTask.title}`);
            }
        }
        // Buat dan simpan tugas baru
        const task = new taskModel_1.default({
            title,
            description,
            startTime: startTimeDate,
            endTime: endTimeDate,
            projectId: project._id,
        });
        yield task.save();
        // Tambahkan tugas ke dalam proyek
        project.tasks.push(task._id);
        yield project.save();
        // Kirimkan data tugas yang telah dibuat kembali ke thread utama
        worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: true, task });
    }
    catch (error) {
        if (error instanceof Error) {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: false, message: error.message });
        }
        else {
            worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.postMessage({ success: false, message: 'An unexpected error occurred' });
        }
    }
});
// Fungsi untuk memeriksa apakah tugas saling tumpang tindih dalam waktu
function doTasksOverlap(startTime1, endTime1, startTime2, endTime2) {
    return startTime1 < endTime2 && startTime2 < endTime1;
}
// Jalankan proses tugas
processTask();
