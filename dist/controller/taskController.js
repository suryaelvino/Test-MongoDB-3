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
exports.deleteTask = exports.searchTasksByKeyword = exports.completedTask = exports.updateTask = exports.getAllTasksUncompletedByProjectId = exports.getAllTasksCompletedByProjectId = exports.getAllTasksByProjectId = exports.createTask = void 0;
const taskModel_1 = __importDefault(require("../model/taskModel"));
const projectModel_1 = __importDefault(require("../model/projectModel"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { title, description, startTime, endTime } = req.body;
    // Validasi data yang dibutuhkan
    if (!title || !startTime || !endTime) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required fields: title, startTime, endTime' });
    }
    // Konversi startTime dan endTime ke objek Date
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    // Validasi: pastikan startTime lebih awal dari endTime
    if (startTimeDate >= endTimeDate) {
        return res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json({ message: 'startTime must be earlier than endTime' });
    }
    try {
        // Cari proyek berdasarkan ID yang diberikan
        const project = yield projectModel_1.default.findById(projectId);
        if (!project) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `Project with ${projectId} not found` });
        }
        // Validasi: pastikan tidak ada tugas yang saling tumpang tindih dalam waktu
        const overlappingTasks = [];
        const existingTasks = yield taskModel_1.default.find({ projectId: projectId });
        for (const existingTask of existingTasks) {
            if (doTasksOverlap(existingTask.startTime, existingTask.endTime, startTimeDate, endTimeDate)) {
                overlappingTasks.push({
                    id: existingTask._id,
                    title: existingTask.title,
                    description: existingTask.description,
                    startTime: existingTask.startTime,
                    endTime: existingTask.endTime,
                });
            }
        }
        if (overlappingTasks.length > 0) {
            return res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json({
                message: 'Task overlaps with existing tasks',
                data: overlappingTasks,
            });
        }
        // Buat objek task baru
        const task = new taskModel_1.default({
            title,
            description,
            startTime: startTimeDate,
            endTime: endTimeDate,
            projectId: project._id,
        });
        // Simpan task baru ke dalam database
        yield task.save();
        // Tambahkan task ke dalam array tasks pada objek project
        project.tasks.push(task._id);
        yield project.save();
        // Kirim respons sukses dengan data task yang telah dibuat
        res.status(http_status_codes_1.default.CREATED).json({ message: 'Successfully create new task', data: task });
    }
    catch (error) {
        // Tangani kesalahan yang terjadi selama proses
        if (error instanceof Error) {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create task', error: error.message });
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.createTask = createTask;
const getAllTasksByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    try {
        const project = yield projectModel_1.default.findById(projectId).populate('tasks');
        if (!project) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `Project with ${projectId} not found`, data: null });
        }
        if (project.tasks.length === 0) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `No tasks found for project ${projectId}`, data: null });
        }
        res.status(http_status_codes_1.default.OK).json({ message: `Successfully get all task with project ${projectId}`, data: project.tasks });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch tasks', error: error.message });
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getAllTasksByProjectId = getAllTasksByProjectId;
const getAllTasksCompletedByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    // Validasi parameter projectId
    if (!projectId) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required parameter: projectId' });
    }
    try {
        const tasks = yield taskModel_1.default.find({ project: projectId, completed: true });
        if (tasks.length === 0) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `No completed tasks found for project ${projectId}` });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Successfully get all completed tasks with project ${projectId}`, data: tasks });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch completed tasks', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getAllTasksCompletedByProjectId = getAllTasksCompletedByProjectId;
const getAllTasksUncompletedByProjectId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    // Validasi parameter projectId
    if (!projectId) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required parameter: projectId' });
    }
    try {
        const tasks = yield taskModel_1.default.find({ project: projectId, completed: false });
        if (tasks.length === 0) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `No uncompleted tasks found for project ${projectId}` });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Successfully get all uncompleted tasks with project ${projectId}`, data: tasks });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch uncompleted tasks', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getAllTasksUncompletedByProjectId = getAllTasksUncompletedByProjectId;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, startTime, endTime } = req.body;
    // Validasi data yang dibutuhkan
    if (!id || !title || !startTime || !endTime) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required fields: id, title, startTime, endTime' });
    }
    // Konversi startTime dan endTime ke objek Date
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    // Validasi: pastikan startTime lebih awal dari endTime
    if (startTimeDate >= endTimeDate) {
        return res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json({ message: 'startTime must be earlier than endTime' });
    }
    try {
        // Cari task yang akan diperbarui berdasarkan ID yang diberikan
        const existingTask = yield taskModel_1.default.findById(id);
        if (!existingTask) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: 'Task not found' });
        }
        // Cari semua task lain dalam proyek yang sama
        const otherTasks = yield taskModel_1.default.find({ _id: { $ne: id }, projectId: existingTask.projectId });
        // Array untuk menyimpan informasi task yang tumpang tindih
        const overlappingTasks = [];
        // Validasi: periksa tumpang tindih waktu dengan task lain
        for (const task of otherTasks) {
            if (doTasksOverlap(task.startTime, task.endTime, startTimeDate, endTimeDate)) {
                overlappingTasks.push({
                    id: task._id,
                    title: task.title,
                    description: task.description,
                    startTime: task.startTime,
                    endTime: task.endTime,
                });
            }
        }
        // Jika terdapat tumpang tindih, kirimkan respons dengan daftar task yang bertabrakan
        if (overlappingTasks.length > 0) {
            return res.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json({
                message: 'Task overlaps with existing tasks',
                data: overlappingTasks,
            });
        }
        // Lakukan pembaruan task
        const updatedTask = yield taskModel_1.default.findByIdAndUpdate(id, {
            title,
            description,
            startTime: startTimeDate,
            endTime: endTimeDate,
        }, { new: true });
        // Kirim respons sukses dengan data task yang telah diperbarui
        return res.status(http_status_codes_1.default.OK).json({ message: `Successfully update task with ${id}`, data: updatedTask });
    }
    catch (error) {
        // Tangani kesalahan yang terjadi selama proses
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update task', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.updateTask = updateTask;
const completedTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validasi parameter taskId
    if (!id) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required parameter id' });
    }
    try {
        const updatedTask = yield taskModel_1.default.findByIdAndUpdate(id, { completed: true }, { new: true });
        if (!updatedTask) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `Task with id ${id} not found` });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Successfully marked task with id ${id} as completed`, data: updatedTask });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to mark task as completed', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.completedTask = completedTask;
const searchTasksByKeyword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q } = req.query;
    // Validasi parameter query q
    if (!q || typeof q !== 'string' || q.trim() === '') {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Parameter query q is required and must be a non-empty string' });
    }
    try {
        // Mencari tugas berdasarkan kata kunci (q) di judul atau deskripsi
        const qLowercase = q.toLowerCase(); // Konversi kata kunci ke huruf kecil
        const tasks = yield taskModel_1.default.find({
            $or: [
                { title: { $regex: new RegExp(q, 'i') } }, // Pencarian di judul dengan ekspresi reguler, case-insensitive
                { description: { $regex: new RegExp(q, 'i') } }, // Pencarian di deskripsi dengan ekspresi reguler, case-insensitive
            ]
        });
        // Jika tidak ada hasil pencarian, kembalikan respons NOT_FOUND
        if (tasks.length === 0) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `No tasks found matching the search term '${q}'`, data: null });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: 'Successfully retrieved tasks by keyword', data: tasks });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to search tasks', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.searchTasksByKeyword = searchTasksByKeyword;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedTask = yield taskModel_1.default.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: `Task ${id} not found` });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Task ${id} deleted successfully` });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: `Failed to delete task with projectId ${id}`, error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.deleteTask = deleteTask;
function doTasksOverlap(startTime1, endTime1, startTime2, endTime2) {
    return startTime1 < endTime2 && startTime2 < endTime1;
}
