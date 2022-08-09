import express from 'express'
import {Member, Members} from '../models/members.js'
import authCheck from '../middlewares/authCheck.js'

const members = new Members()

const addMembers = async(req, res) => {
    const member = await members.addProjectMember(req, res)
}

const removeMember = async(req, res) => {
    const member = await members.removeProjectMember(req, res)
}

const leaveAsMember = async(req, res) => {
    const member = await members.leaveProjectAsMember(req, res)
}
const memberRoutes = (app) => {
app.post('/addmem/:projectId',authCheck, addMembers)
app.post('/rem/:projectId/member/:memberId', authCheck, removeMember)
app.post('/remm/:projectId', authCheck, leaveAsMember)
}

export default memberRoutes;
