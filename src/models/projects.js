import client from '../../database.js'
import express from 'express'
import {createProjectValidator} from '../validations/userVal.js'
import {projectNameError} from '../validations/userVal.js'

export const Project = {
    id: String,
    createdAt: String,
    updatedAt: String,
    name: String,
    createdById: String,
}

export class Projects {

		 async getProjects(req, res){
			const conn = await client.connect()
			const sql = `select projectid from projects
									 left join members
									 on projects.id = members.projectid 
									 where members.memberid = ($1)`
			const projectIds = await conn.query(sql, [req.user])
		  await Promise.all(projectIds.rows.map(async (project) => {
					project.members = await this.getMembers(project.projectid)
		  })
		  )
		  res.status(200).json({ Projects: projectIds.rows })
		 }
		 
		 async getMembers(projectId){
				const conn = await client.connect()
				const sql = `select users.username, memberid, joinedat
										 from members
										 left join users
										 on memberid = users.id
										 where projectid = ($1)`
				const members = await conn.query(sql, [projectId])
				return members.rows
		 }
		 
     async createProject(req, res){
				const {name} = req.body
				const membersIds = req.body.members
				? ([req.user, ...req.body.members])
				: [req.user]
				
				const {error, valid} = createProjectValidator(name, membersIds)
				if(!valid) {
					return res.status(400).send({message: Object.values(error)[0]});
				}
				const conn = await client.connect()
				const sql = 'INSERT INTO projects (name,createdbyid) VALUES ($1, $2) RETURNING *'
				const result = await conn.query(sql,[name,req.user])
				const projectId = result.rows[0].id
				const membersArray = membersIds.map((memberId) => ({
						memberId,
						projectId
				}))
				const sql2 = 'INSERT INTO members (projectid, memberid) VALUES ($1, $2) RETURNING *';
						for(let i=0; i<membersArray.length; i++){
							await conn.query(sql2,
												[membersArray[i].projectId,
									membersArray[i].memberId])
							}
				conn.release(); 
				return res.status(200).json({
					id: result.rows[0].id,
					name: result.rows[0].name
				})
}
     
     async updateProjectName(req,res){
       const {name} = req.body
       const projectId = req.params['projectid']

       const nameValidatorError = projectNameError(name);

       if(!nameValidatorError){
       	return res.status(400).send({ message: nameValidatorError });
       }

       const conn = await client.connect()
       const sql = 'SELECT * FROM projects WHERE id = ($1)';                    
       const result = await conn.query(sql,[projectId])
       if(result.rows == false)
           return res.status(404).send({ message: 'Invalid project ID.' });
       if(result.rows[0].createdbyid !== req.user)
          return res.status(401).send({ message: 'Access is denied.' });
       const sql2 = 'update projects set name = ($1) where id = ($2) and createdById = ($3) RETURNING *';
       const result2 = await conn.query(sql2,[name,projectId,req.user])
       return res.status(200).json({
       	id: projectId,
       	newName: name
       })
 }
 
 async deleteProject(req, res){
	const projectId = req.params['projectid']
	const conn = await client.connect()
	const sql = 'SELECT createdbyid from projects WHERE id = ($1)'
	const result = await conn.query(sql,[projectId])
	if(result.rows == false)
		return res.status(201).json({message:"Invalid project id"})
	if(result.rows[0].createdbyid != req.user)
		return res.status(201).json({message:"Access denied"})
	const sqlProject = 'DELETE FROM projects WHERE id = ($1)'
	const sqlMember = 'DELETE FROM members WHERE projectid = ($1)'
	const sqlBug = 'DELETE FROM bugs WHERE projectid = ($1)'
	await conn.query(sqlBug,[projectId])
	await conn.query(sqlMember,[projectId])
	await conn.query(sqlProject,[projectId])
	res.status(204).end();
 }
}
