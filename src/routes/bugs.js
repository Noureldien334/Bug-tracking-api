import express from 'express'
import {Bug, Bugs} from '../models/bugs.js'
import authCheck from '../middlewares/authCheck.js'

const bugs = new Bugs()

const getBugs = async(req, res) => {
      const bug = await bugs.getBugs(req, res)
}

const create = async (req,res) => {
      const bug = await bugs.createBug(req,res)
}

const update = async(req, res) => {
		const bug = await bugs.updateBug(req, res)
}

const destroy = async(req, res) => {
    const bug = await bugs.deleteBug(req, res)
}

const closeBug = async(req, res) => {
    const bug = await bugs.closeBug(req, res)
}

const reopenBug = async(req, res) =>{
    const bug = await bugs.reopenBug(req, res)
}

const bugRoutesss = (app) => {
app.get('/:projectId/bugs', authCheck, getBugs)
app.post('/createbug/:projectId', authCheck, create)
app.put('/:projectId/bug/:bugId', authCheck, update)
app.put('/:projectId/close/:bugId', authCheck, closeBug)
app.put('/:projectId/reopen/:bugId', authCheck, reopenBug)
app.delete('/:projectId/del/:bugId', authCheck, destroy)
}

export default bugRoutesss
