import express from 'express'
import  {login, register, index} from '../routes/users.js'

const router = express.Router();
router.route('/').post(login).post(register)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

module.exports = router
