import prisma from '../lib/prisma.js'

// GET /api/tasks
export const getAllTasks = async (req, res) => {
    try {
        const {sort} = req.query
        const order = sort === 'asc' ? 'asc' : 'desc'

        const tasks = await prisma.task.findMany({
            where: {userId: req.user.userId},
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
        const {description, priority, dueDate, projectId } = req.body

        if (!description || description.trim() === '') {
            return res.status(400).json({success: false, message: "Description is required"})
        }

        const newTask = await prisma.task.create({
            data: {
                description: description.trim(),
                priority: priority || 'medium',
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: req.user.userId,
                projectId: projectId || null
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
        const {description, priority, dueDate} = req.body

        if (!description || description.trim() === '') {
            return res.status(400).json({success: false, message: "Description is required"})
        }

        const task = await prisma.task.findUnique({where: {id}})

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({success: false, message: 'Not authorized'})
        }

        const updatedTask = await prisma.task.update({
            where: {id},
            data: {
                description: description.trim(),
                ...(priority && {priority}),
                ...(dueDate !== undefined && {dueDate: dueDate ? new Date(dueDate) : null})
            }
        })

        res.status(200).json({success: true, data: updatedTask})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task'})
    }
}

// DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const {id} = req.params

        const task = await prisma.task.findUnique({where: {id}})

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({success: false, message: 'Not authorized'})
        }

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

        const task = await prisma.task.findUnique({where: {id}})

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({success: false, message: 'Not authorized'})
        }

        const updatedTask = await prisma.task.update({
            where: {id},
            data: {status: status}
        })

        res.status(200).json({success: true, data: updatedTask})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task status'})
    }
}

// PUT /api/tasks/:id/priority
export const updateTaskPriority = async (req, res) => {
    try {
        const {id} = req.params
        const {priority} = req.body
        const validPriorities = ['low', 'medium', 'high']

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({success: false, message: "Invalid priority value"})
        }

        const task = await prisma.task.findUnique({where: {id}})

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({success: false, message: 'Not authorized'})
        }

        const updatedTask = await prisma.task.update({
            where: {id},
            data: {priority: priority}
        })

        res.status(200).json({success: true, data: updatedTask})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task priority'})
    }
}

// PUT /api/tasks/:id/due-date
export const updateTaskDueDate = async (req, res) => {
    try {
        const {id} = req.params
        const {dueDate} = req.body

        const date = new Date(dueDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (date < today) {
            return res.status(400).json({success: false, message: 'Due date cannot be in the past'})
        }

        const task = await prisma.task.findUnique({where: {id}})

        if (!task) {
            return res.status(404).json({success: false, message: 'Task not found'})
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({success: false, message: 'Not authorized'})
        }

        const updatedTask = await prisma.task.update({
            where: {id},
            data: {dueDate: new Date(dueDate)}
        })

        res.status(200).json({success: true, data: updatedTask})
    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to update task due date'})
    }
}