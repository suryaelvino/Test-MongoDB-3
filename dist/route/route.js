"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project = __importStar(require("../controller/projectController"));
const task = __importStar(require("../controller/taskController"));
const router = express_1.default.Router();
router.post('/projects', project.createProject);
router.get('/projects', project.getAllProjects);
router.get('/projects/:id', project.getProjectById);
router.put('/projects/:id', project.updateProject);
router.delete('/projects/:id', project.deleteProject);
router.post('/projects/:projectId/tasks', task.createTask);
router.get('/projects/:projectId/tasks', task.getAllTasksByProjectId);
router.get('/projects/:projectId/completedtasks', task.getAllTasksCompletedByProjectId);
router.get('/projects/:projectId/uncompletedtasks', task.getAllTasksUncompletedByProjectId);
router.get('/tasks/search', task.searchTasksByKeyword);
router.put('/tasks/:id', task.updateTask);
router.put('/completedtasks/:id', task.completedTask);
router.delete('/tasks/:id', task.deleteTask);
exports.default = router;
