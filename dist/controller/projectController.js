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
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const projectModel_1 = __importDefault(require("../model/projectModel"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    // Validasi request body
    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Name is required and must be a non-empty string' });
        return;
    }
    if (!description || typeof description !== 'string') {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Description is required and must be a string' });
        return;
    }
    try {
        const project = yield projectModel_1.default.create({ name, description });
        return res.status(http_status_codes_1.default.CREATED).json({ message: 'Success create new project', data: project });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create project', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.createProject = createProject;
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projectModel_1.default.find();
        if (projects.length === 0) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: 'No projects found', data: null });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: 'Success get all projects', data: projects });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch all projects', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getAllProjects = getAllProjects;
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validasi parameter id
    if (!id) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required parameter: id' });
    }
    try {
        const project = yield projectModel_1.default.findById(id);
        if (!project) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `Project ${id} not found`, data: null });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Success get detail project ${id}`, data: project });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch project', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getProjectById = getProjectById;
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    // Validasi parameter id dan request body
    if (!id) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required parameter: id' });
    }
    if (!name || typeof name !== 'string' || name.trim() === '') {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Name is required and must be a non-empty string' });
        return;
    }
    if (!description || typeof description !== 'string') {
        res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Description is required and must be a string' });
        return;
    }
    try {
        const updatedProject = yield projectModel_1.default.findByIdAndUpdate(id, { name, description }, { new: true });
        if (!updatedProject) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `Project ${id} not found` });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Success update with project ${id}`, data: updatedProject });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to update project', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validasi parameter id
    if (!id) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Missing required parameter: id' });
    }
    try {
        const deletedProject = yield projectModel_1.default.findByIdAndDelete(id);
        if (!deletedProject) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `Project ${id} not found`, data: null });
        }
        return res.status(http_status_codes_1.default.OK).json({ message: `Project ${id} was deleted`, data: null });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Failed to delete project', error: error.message });
        }
        else {
            return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json({ message: 'An unexpected error occurred' });
        }
    }
});
exports.deleteProject = deleteProject;
