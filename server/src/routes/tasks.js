import {Router} from 'express'
import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
} from '../controllers/taskController.js'

const router = Router()

router.get('/', getAllTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.patch('/:id/status', updateTaskStatus)

export default router