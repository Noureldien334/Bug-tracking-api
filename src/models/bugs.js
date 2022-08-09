import client from '../../database.js'
import express from 'express'
import createBugValidator from '../validations/userVal.js'

export const Bug = {
	id: String,
	title: String,  
	description: String, 
	priority: Number,  
	projectId: String,  
	isresolved: Boolean,  
	closedById: String , 
	closedAt: String  ,
	reopenedById: String,  
	reopenedAt: String  ,
	createdById: String  ,
	createdAt: String  ,
	updatedById: String , 
	updatedAt: String,
}

export class Bugs{

  async getBugs(req, res){
		const {projectId} = req.params
		const conn = await client.connect()
		const sql = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result = await conn.query(sql, [projectId, req.user])
		if(result.rows == false)
			res.status(401).send({message: "Access denied"})

		const bugsSql = `select bugs.id, bugs.title, bugs.description,
				 bugs.priority, bugs.isresolved, bugs.createdat,
				 bugs.updatedat, bugs.closedat, bugs.reopenedat,
				 u1.username as "Created By", u2.username as "Closed By",
				 u3.username as "Updated By",
				 u4.username as "Reopened By" 
				 from bugs
				 left join users as u1 on bugs.createdbyid = u1.id
				 left join users as u2 on bugs.closedbyid = u2.id
				 left join users as u3 on bugs.updatedbyid = u3.id
				 left join users as u4 on bugs.reopenedbyid = u4.id
				 where bugs.projectid = ($1)`
		let bugs = await conn.query(bugsSql,[projectId])
		const bugsIds = bugs.rows.map((bug) => bug.id)
	  //	bugs.rows[0].Note = ["Note1", "Note2"]
	  await Promise.all(bugs.rows.map(async (bug) => {
				bug.Note = await this.getNotes(bug.id)
		}))
		res.status(200).json({Bugs: bugs.rows})
 }

 async getNotes(bugId){
	const conn = await client.connect()
	const sql = `select notes.id,notes.body,
							 notes.authorid,
							 notes.bugid,
							 notes.createdat,
							 notes.updatedat,
							 Author.username
							 from notes left join users as Author 
							 on notes.authorid = Author.id
							 where bugid = ($1)`
	const notes = await conn.query(sql,[bugId])
	
	return notes.rows;

 }

	async createBug(req, res){
		const {title, description, priority} = req.body
		const projectId = req.params['projectId']
		const { errors, valid } = createBugValidator(title, description, priority)
		
		if(valid)
		    return res.status(400).send({ message: Object.values(errors)[0] });
		
		const conn = await client.connect()
		const sql = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result = await conn.query(sql, [projectId, req.user])
		
		if(result.rows == false)
			res.status(401).send({message: "Access denied"})
		const sql2 = 'INSERT INTO bugs ( title, description, priority, projectid, createdbyid) values ($1, $2, $3, $4, $5) RETURNING *'
		const result2 = await conn.query(sql2, [title, description, priority, projectId, req.user])
		
		return res.status(200).json({
			id: result2.rows[0].id,
			title: result2.rows[0].title,
			description: result2.rows[0].description,
			createdBy : result2.rows[0].createdbyid,
			createdAt: result2.rows[0].createdat
		})
	}
	
	async updateBug(req, res){
		const {title, description, priority} = req.body
		const projectId = req.params['projectId']
		const bugId = req.params['bugId']
		const { errors, valid } = createBugValidator(title, description, priority);
		
		if (valid) {
			return res.status(400).send({ message: Object.values(errors)[0] });
		}
		const conn = await client.connect()
		const sql = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result = await conn.query(sql, [projectId, req.user])
		if(result.rows == false)
			res.status(401).send({message: "Access denied"})
		
		const targetBugSql = 'SELECT id FROM bugs WHERE id = ($1)'
		const result2 = await conn.query(targetBugSql, [bugId])
		
		if(result2.rows == false)
			return res.status(400).send({ message: 'Invalid bug ID.' });
		
		result2.rows[0].title = title
		result2.rows[0].description = description
		result2.rows[0].priority = priority
		result2.rows[0].updatedbyid = req.user
		result2.rows[0].updatedat = new Date()
		
		const updateSql = `UPDATE bugs SET 
											 title = ($1)
											 ,description = ($2)
											 ,priority = ($3)
											 ,updatedbyid = ($4)
											 ,updatedat = ($5)
											 WHERE id = ($6)`
		
		await conn.query(updateSql,
										[title
										,description
										,priority
										,req.user
										,new Date()
										,bugId]
										)
								
		conn.release()
		res.status(201)
	}

	async deleteBug(req, res){
	  const projectId = req.params['projectId']
	  const bugId = req.params['bugId']
	  const conn = await client.connect()
		const sql = 'SELECT * FROM projects WHERE id = ($1)'
		const targetProject = await conn.query(sql,[projectId])
		
		if(targetProject.rows == false)
			res.status(404).send({message: "Inavlid Project ID"})
		
		const targetBugSql = 'SELECT id FROM bugs WHERE id = ($1)'
		const result2 = await conn.query(targetBugSql, [bugId])
		
		if(result2.rows == false)
			return res.status(400).send({ message: 'Invalid bug ID.' });
		
		if(targetProject.rows[0].createdbyid !== req.user &&
			 result2.rows[0].createdbyid !== req.user
		)
		  return res.status(401).send({ message: 'Access is denied.' });
		
		const noteSqlDel = 'DELETE FROM notes WHERE bugid = ($1)' 
		const bugSqlDel = 'DELETE FROM bugs WHERE id = ($1)' 
		await conn.query(noteSqlDel, [bugId])
		await conn.query(bugSqlDel, [bugId])
		res.status(204).end()
		
	}
	
	async closeBug(req, res){
		const { projectId, bugId } = req.params;
		const conn = await client.connect()
		const sql = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result = await conn.query(sql, [projectId, req.user])
		if(result.rows == false)
			res.status(401).send({message: "Access denied"})
			
		const targetBugSql = 'SELECT isresolved FROM bugs WHERE id = ($1)'
		const result2 = await conn.query(targetBugSql, [bugId])
		if (!result2.rows) {
			return res.status(400).send({ message: 'Invalid bug ID.' });
		}
		if(result2.rows[0].isresolved === true)
		 return res
      .status(400)
      .send({ message: 'Bug is already marked as closed.' });
      
    const updateBug = `UPDATE bugs SET 
											 isresolved = ($1)
											 ,closedbyid = ($2)
											 ,closedat = ($3)
											 ,reopenedbyid = ($4)
											 ,reopenedat = ($5)
											 WHERE id = ($6)`
		
    await conn.query(updateBug,
										[true,
										req.user,
										new Date(),
										null,
										null,
										bugId]
										)
		  return res.status(201).json({message: "Closed a bug"});
	}
	
	async reopenBug(req, res){
		const projectId = req.params['projectId']
	  const bugId = req.params['bugId']
	  const conn = await client.connect()
		const sql = 'SELECT memberid FROM members WHERE projectid = ($1) AND memberid = ($2)'
		const result = await conn.query(sql, [projectId, req.user])
		if(result.rows == false)
			res.status(401).send({message: "Access denied"})
		const targetBugSql = 'SELECT isresolved FROM bugs WHERE id = ($1)'
		const result2 = await conn.query(targetBugSql, [bugId])
		if (!result2.rows) {
			return res.status(400).send({ message: 'Invalid bug ID.' });
		}
		if(result2.rows[0].isresolved === false)
			return res
      .status(400)
      .send({ message: 'Bug is already marked as opened.' });
      
    const updateQuery = `UPDATE bugs SET 
											 isresolved = ($1)
											 ,reopenedbyid = ($2)
											 ,reopenedat= ($3)
											 ,closedbyid = ($4)
											 ,closedat = ($5)
											 WHERE id = ($6)`
		await conn.query(updateQuery,
										[false
										,req.user
										,new Date()
										,null
										,null
										,bugId]
										)
		res.status(201).end()
	}
	
}
