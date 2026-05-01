import prisma from '../lib/prisma.js'

// GET /api/projects
export const getAllProjects = async (req, res) => {
    try {
        const { sort } = req.query
        const order = sort === 'asc' ? 'asc' : 'desc'

        const projects = await prisma.project.findMany({
            where: { userId: req.user.userId },
            orderBy: {
                name: order
            }
        })

        res.status(200).json({ success: true, data: projects })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch projects' })
    }
}

// POST /api/projects
export const createProject = async (req, res) => {
    try {
        const { name } = req.body

        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: "Project name is required" })
        }

        const newProject = await prisma.project.create({
            data: {
                name: name.trim(),
                userId: req.user.userId
            }
        })

        res.status(201).json({ success: true, data: newProject })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create project' })
    }
}

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body

        if (!name || name.trim() === '') {
            return res.status(400).json({ success: false, message: "Project name is required" })
        }

        const project = await prisma.project.findUnique({ where: { id }, })

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" })
        }

        if (project.userId !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' })
        }

        const updatedProject = await prisma.project.update({
            where: { id },
            data: {
                name: name.trim(),
            }
        })

        res.status(200).json({ success: true, data: updatedProject })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update project' })
    }
}

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params

        const project = await prisma.project.findUnique({ where: { id } })

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" })
        }

        if (project.userId !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Not authorized' })
        }

        await prisma.task.deleteMany({
            where: { projectId: id }
        })
        const deletedProject = await prisma.project.delete({ where: { id } })

        res.status(200).json({ success: true, data: deletedProject })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete project' })
    }
}