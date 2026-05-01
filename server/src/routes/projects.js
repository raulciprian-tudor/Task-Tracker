import { Router } from 'express'
import auth from '../middleware/auth.js'
import { getAllProjects, createProject, updateProject, deleteProject } from '../controllers/projectController.js'


const router = Router()

router.get('/', auth, getAllProjects)
router.post('/', auth, createProject)
router.put('/:id', auth, updateProject)
router.delete('/:id', auth, deleteProject)

export default router