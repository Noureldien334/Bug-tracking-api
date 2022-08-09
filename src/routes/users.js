import express from 'express'
import {User, Users} from '../models/users.js'
import authCheck from '../middlewares/authCheck.js'
const users = new Users()

const index = async (req,res) => {
      const userss = await users.showAllUsers()
      res.json(userss)
}

const login = async (req, res) => {
	const result = await users.loginUser(res,req.body.username, req.body.password)
}

const register = async (req, res) => {
	const user = await users.createUser(res,req.body.username, req.body.password)
}
const bugRoutess = (app) => {
app.get('/users', index)
app.post('/login', login)
app.post('/signup', register)
}

export default bugRoutess;
