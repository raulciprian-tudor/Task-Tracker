import {Router} from 'express'
import auth from '../middleware/auth.js'
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

router.get('/', auth, getAllTasks)
router.post('/', auth, createTask)
router.put('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)
router.patch('/:id/status', auth, updateTaskStatus)
router.patch('/:id/priority', auth, updateTaskPriority)
router.patch('/:id/due-date', auth, updateTaskDueDate)

export default router