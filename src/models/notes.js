import client from '../../database.js'
import express from 'express'

export const Note = {
	id: String,
	body: String,
	authorId: String,
	bugId: String,
	createdAt: String,
	updatedAt: String,
}

export class Notes {
	
	async postNote(req, res){
		const { body } = req.body;
		const { projectId, bugId } = req.params;
		console.log(projectId)
		console.log(req.user)
		if (!body || body.trim() === '') {
    return res
      .status(400)
      .send({ message: 'Note body field must not be empty.' });
		}
		const conn = await client.connect()
		const sql = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result = await conn.query(sql, [projectId, req.user])

		if(result.rows == false)
			return res.status(401).send({message: "Access denied, not a member of the project."})
		
		const insertSql = 'INSERT INTO notes (body, authorid, bugId) values ($1, $2, $3)'
		const result2 = await conn.query(insertSql, [body, req.user, bugId])
		
		res.status(201).end()
		
	}
	
	async deleteNote(req, res){
		const { projectId, noteId } = req.params;
		const conn = await client.connect()
		const sql = 'SELECT * FROM projects WHERE id = ($1)'
		const targetProject = await conn.query(sql,[projectId])
		
		if(targetProject.rows == false)
			res.status(404).send({message: "Inavlid Project ID"})
			
		const sql2 = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result2 = await conn.query(sql2, [projectId, req.user])

		if(result2.rows == false)
			return res.status(401).send({message: "Access denied, not a member of the project."})
		
		const sql3 = 'SELECT * FROM notes WHERE bugid = ($1)'
		const result3 = await conn.query(sql3, [noteId])
		
		if(result3.rows == false)
			 return res.status(404).send({ message: 'Invalid note ID.' })
		
		if ( result3.rows[0].authorid !== req.user &&
				targetProject.rows[0].createdbyid !== req.user)
					    return res.status(401).send({ message: 'Access is denied.' });
		if (
    result3.rows[0].authorid !== req.user ||
    targetProject.rows[0].createdbyid !== req.user
		) 
			return res.status(401).send({ message: 'Access is denied.' });
		 const delSql = 'DELTE FROM notes WHERE id = ($1)'
		 await conn.query(delSql, [noteId])
		 res.status(204).end();
		
	}
	
	async updateNote(req, res){
		const { body } = req.body;
		const { projectId, noteId } = req.params;
		
		if (!body || body.trim() === '') {
    return res
      .status(400)
      .send({ message: 'Note body field must not be empty.' });
		}
		
		const conn = await client.connect()
		const sql2 = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result2 = await conn.query(sql2, [projectId, req.user])
		
		if(result2.rows == false)
					return res.status(401).send({message: "Access denied, not a member of the project."})
		const sql3 = 'SELECT * FROM notes WHERE id = ($1)'
		const result3 = await conn.query(sql3, [noteId])
		
		if(result3.rows == false)
			 return res.status(404).send({ message: 'Invalid note ID.' })
		
		
		if (result3.rows[0].authorid !== req.user) {
			return res.status(401).send({ message: 'Access is denied.' });
		}
		
		const updateSql = 'UPDATE notes SET body = ($1) WHERE id = ($2)';
		await conn.query(updateSql, [body, noteId])
		res.status(200).end()
  }
}
