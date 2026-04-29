import {readFile, writeFile} from 'fs/promises'
import {fileURLToPath} from 'url'
import {randomUUID} from 'crypto'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '../data/tasks.json')

// Helper - read tasks from file
const readTasks = async () => {
    try {
        const data = await readFile(DB_PATH, 'utf-8')
        return JSON.parse(data)
    } catch {
        return []
    }
}

// Helper - write tasks to file
const writeTasks = async (data) => {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2)); // write file expects a string - null, 2 just formats the JSON
}

// GET /api/tasks
export const getAllTasks = async (req, res) => {
    try {
        const tasks = await readTasks()
        res.status(200).json({success: true, data: tasks})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to fetch tasks'})
    }
}

// POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const tasks = await readTasks()

        const newTask = {
            id: randomUUID(),
            description: req.body.description,
            status: "todo",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        tasks.push(newTask)
        await writeTasks(tasks)

        res.status(201).json({success: true, data: newTask}) // use status code 201 for success on POST

    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to create task'})
    }
}

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const {id} = req.params
        const tasks = await readTasks()

        const index = tasks.findIndex(task => task.id === id)

        if (index === -1) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        tasks[index].description = req.body.description;
        tasks[index].updatedAt = new Date().toISOString()

        await writeTasks(tasks)

        res.status(200).json({success: true, data: tasks[index]})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task'})
    }
}

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const {id} = req.params
        const tasks = await readTasks()
        let deletedTask = {}

        const index = tasks.findIndex(task => task.id === id)

        if (index === -1) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }
        deletedTask = tasks.splice(index, 1)[0]; // splice returns an array, so we add [0] to grab the first element

        await writeTasks(tasks)

        res.status(200).json({success: true, data: deletedTask})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to delete task'})
    }
}

// PUT /api/tasks/:id/status
export const updateTaskStatus = async (req, res) => {
    try {
        const {id} = req.params
        const {status} = req.body
        const validStatuses = ['todo', 'in-progress', 'done']

        const tasks = await readTasks()

        const index = tasks.findIndex(task => task.id === id)

        if (index === -1) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({success: false, message: 'Invalid status value'})
        }

        tasks[index].status = status
        tasks[index].updatedAt = new Date().toISOString()

        await writeTasks(tasks)

        res.status(200).json({success: true, data: tasks[index]})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task status'})
    }
}
