import express from 'express'
import {Note, Notes} from '../models/notes.js'
import authCheck from '../middlewares/authCheck.js'

const notes = new Notes()

const create = async (req,res) => {
      const note = await notes.postNote(req, res)
}

const destroy = async(req, res) =>{
      const note = await notes.deleteNote(req, res)
}

const update = async(req, res) => {
      const note = await notes.updateNote(req, res)
}

const noteRoutes = (app) => {
app.post('/:projectId/postn/:bugId', authCheck, create)
app.delete('/:projectId/del/:noteId', authCheck, destroy)
app.put('/:projectId/upd/:noteId', authCheck, update)
}

export default noteRoutes;
