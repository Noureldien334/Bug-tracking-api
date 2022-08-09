import express from 'express'
import {Project, Projects} from '../models/projects.js'
import authCheck from '../middlewares/authCheck.js'

const projects = new Projects()

const getProjects = async (req, res) => {
      const project = await projects.getProjects(req, res)
}

const create = async (req,res) => {
      const project = await projects.createProject(req,res)
}

const update = async(req, res) => {
		const project = await projects.updateProjectName(req, res)
}

const destroy = async(req, res) => {
    const project = await projects.deleteProject(req, res)
}

const bugRoutes = (app) => {
app.get('/projects', authCheck, getProjects)
app.post('/createproject',authCheck, create)
app.put('/:projectid', authCheck, update)
app.delete('/:projectid', authCheck, destroy)
}

export default bugRoutes;
