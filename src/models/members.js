import client from '../../database.js'
import express from 'express'
import projectMemberError from '../validations/userVal.js'

export const Member = {
	id: String,
	projectId: String,
	memberId: String,
	joinedAt: String
}

export class Members{
	
	async addProjectMember(req, res){
		const memberIds = req.body.members
		const projectId = req.params['projectId']
		const valid = projectMemberError(memberIds)
		
		if(!valid)
			return res.status(400).send({message:"Members mustn't be an empty array"})
		
		const conn = await client.connect()
		const sql = 'SELECT * FROM projects WHERE id = ($1)'
		const targetProject = await conn.query(sql,[projectId])
		
		if(targetProject.rows == false)
			res.status(404).send({message: "Inavlid Project ID"})
			
		if(targetProject.rows[0].createdbyid !== req.user)
			res.status(401).send({message: "Access denied"})
			
		const sql2 = 'SELECT memberid FROM members WHERE projectid = ($1)'
		const result2 = await conn.query(sql2, [projectId])
		const membersArray = memberIds.map((memberId) => ({
			memberId,
			projectId,
		}));
		
		const sql3 = 'INSERT INTO members (projectid, memberid) VALUES ($1, $2) RETURNING *';
		for(let i=0; i<membersArray.length; i++){
						await conn.query(sql3,
														[membersArray[i].projectId,
														membersArray[i].memberId])
		}
		
		conn.release(); 
		}
		
		async removeProjectMember(req, res){
				const projectId = req.params['projectId']
				const memberId = req.params['memberId']
				const conn = await client.connect()
				const sql = 'SELECT * FROM projects WHERE id = ($1)'
				const targetProject = await conn.query(sql,[projectId])
	
				if(targetProject.rows == false)
					res.status(404).send({message: "Inavlid Project ID"})
					
				if(targetProject.rows[0].createdbyid !== req.user)
					res.status(401).send({message: "Access denied"})
				
				const sql2 = 'SELECT id FROM members WHERE memberid = ($1)'
				const targetMember = await conn.query(sql2, [memberId])
				if(targetMember.rows == false)
					return res.status(404).send({
							message: "Member isn't part of the project or already removed.",
					});
				if (targetProject.rows[0].createdbyid === memberId) {
					return res
								.status(400)
								.send({ message: "Project creator can't be removed." });
				}
				
				const deleteSql = 'DELETE FROM members WHERE memberid = ($1)'
				await conn.query(deleteSql, [memberId])
				conn.release()
				res.status(204).end();
		
		}
		
		async leaveProjectAsMember(req, res) {
			const projectId = req.params['projectId']
			const conn = await client.connect()
			const sql = 'SELECT * FROM projects WHERE id = ($1)'
			const targetProject = await conn.query(sql,[projectId])
			
			if(targetProject.rows == false)
					res.status(404).send({message: "Inavlid Project ID"})
			
			if(targetProject.rows[0].createdbyid !== req.user)
					res.status(401).send({message: "Access denied"})
			
			if (targetProject.createdById === req.user) 
					return res.status(400).send({ message: "Project creator can't leave." });
					
			const sql2 = 'SELECT id FROM members WHERE memberid = ($1)'
				const targetMember = await conn.query(sql2, [req.user])
				if(targetMember.rows == false)
					return res.status(404).send({
							message: "You aren't part of the project.",
					});
					
			const deleteSql = 'DELETE FROM members WHERE memberid = ($1)'
			await conn.query(deleteSql, [req.user])
			conn.release()
			res.status(204).end();
			
		}

}
