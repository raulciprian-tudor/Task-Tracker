import {Router} from 'express'
import {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskPriority,
    updateTaskDueDate
} from '../controllers/taskController.js'

const router = Router()

router.get('/', getAllTasks)
router.post('/', createTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.patch('/:id/status', updateTaskStatus)
router.patch('/:id/priority', updateTaskPriority)
router.patch('/:id/due-date', updateTaskDueDate)

export default router