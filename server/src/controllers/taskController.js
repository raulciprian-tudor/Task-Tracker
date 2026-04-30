import prisma from '../lib/prisma.js'

// GET /api/tasks
export const getAllTasks = async (req, res) => {
    try {
        const {sort} = req.query
        const order = sort === 'asc' ? 'asc' : 'desc'

        const tasks = await prisma.task.findMany({
            orderBy: {
                createdAt: order
            }
        })

        res.status(200).json({success: true, data: tasks})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to fetch tasks'})
    }
}

// POST /api/tasks
export const createTask = async (req, res) => {
    try {
        const {description} = req.body

        if (!description || description.trim() === '') {
            return res.status(404).json({success: false, message: "Description is required"})
        }

        const newTask = await prisma.task.create({
            data: {
                description: description.trim()
            }
        })

        res.status(201).json({success: true, data: newTask}) // use status code 201 for success on POST

    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to create task'})
    }
}

// PUT /api/tasks/:id
export const updateTask = async (req, res) => {
    try {
        const {id} = req.params
        const {description} = req.body

        if (!description || description.trim() === '') {
            return res.status(404).json({success: false, message: "Description is required"})
        }

        const task = await prisma.task.update({
            where: {id},
            data: {description: description.trim()}
        })

        res.status(200).json({success: true, data: task})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task'})
    }
}

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const {id} = req.params

        const deletedTask = await prisma.task.delete({
            where: {id}
        })

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

        if (!validStatuses.includes(status)) {
            return res.status(400).json({success: false, message: 'Invalid status value'})
        }

        const task = await prisma.task.update({
            where: {id},
            data: {status: status}
        })

        res.status(200).json({success: true, data: task})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task status'})
    }
}
