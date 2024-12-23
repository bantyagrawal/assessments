const { taskModel } = require("../Schema/taskSchema");
const { findOne, saveData, deleteID, findByQuery, findByIdAndUpdate } = require("../Dao/dao");
const { statusCode } = require('../Constant/constant');
const { generateError, sendResponse } = require("../Utils/utils");

const createTaskService = async (req) => {
    try {
        const { title } = req;
        if (!title) {
            const err = new Error(error.message);
            err.status = statusCode.Unauthorized;
            throw err;
        }
        const query = { title };
        const taskFound = await findOne(taskModel, query);
        if (taskFound) {
            const error = new Error('Task already exist');
            error.status = statusCode['Already Reported'];
            throw error;
        }
        const taskDate = await saveData(taskModel, req);
        return await sendResponse('Task has been created', taskDate);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const deleteTaskService = async (req) => {
    try {
        const { _id } = req;
        const deletedTask = await deleteID(taskModel, _id);
        if (!deletedTask) {
            throw await generateError('Task not found', statusCode['Not Found']);
        }
        return await sendResponse('Task has been deleted', deletedTask);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const getTaskService = async () => {
    try {
        const taskList = await taskModel.find({});
        return await sendResponse('Task list', taskList);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
};

const getUserTaskService = async (req) => {
    try {
        const { _id } = req.user;
        const query = { user_id: _id };
        const userTaskList = await findByQuery(taskModel, query);
        return await sendResponse('Task list', userTaskList);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}

const updateTaskService = async (req) => {
    try {
        const { _id } = req;
        const updatedTask = await findByIdAndUpdate(taskModel, _id, req);
        if (!updatedTask) {
            throw await generateError('Task not found', statusCode['Not Found']);
        }
        return await sendResponse('Task has been updated', updatedTask);
    } catch (error) {
        throw await generateError(error.message, statusCode['Bad Request']);
    }
}
module.exports = {
    createTaskService,
    deleteTaskService,
    getTaskService,
    getUserTaskService,
    updateTaskService,
}