import client from '../../database.js'
import bcrypt from 'bcrypt'
import registerVal from '../validations/userVal.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config({path:'../../.env'})
const {
	JWT_SECRET
} = process.env

export const User = {
	id: String,
	createdAt: String,
	updatedAt: String,
	username: String,
	passwordHashed: String,
}

//CRUD Functions
export class Users {

	async showAllUsers() {
	  try{
	    const conn = await client.connect()
	    const sql = 'SELECT * FROM users'
	    const result = await conn.query(sql);
	    conn.release()
	    return result.rows
	  } catch (err) {
	  	console.log("Can't get users")
	  }
	}

	async createUser(res,username,password) {
		const {error, valid} = registerVal(username, password)
		
		console.log(valid)
    if(!valid)
			return res.status(201).json({message: Object.values(error)[0]})
		const result = await this.checkUsername(username) // expecting false
		if(result)
			return res.status(201).json({message:"Username already exists"})
		const saltRounds = 10;
  	const passwordHash = await bcrypt.hash(password, saltRounds);
		try{
			const conn = await client.connect()
			const sql = 'INSERT INTO users (username,passwordhashed) VALUES ($1,$2) RETURNING *'
			const user = await conn.query(sql,[username, passwordHash])
			conn.release()
			const token = jwt.sign(
    	{
      	id: user.rows[0].id,
      	username: user.rows[0].username,
    	},
    		JWT_SECRET
  		);

			return res.status(200).json({
					id: user.rows[0].id,
					username: user.rows[0].username,
					token
			})
		} catch(err){
			return err
		  }
	}

	async loginUser(res, username, password){
		const result = await this.checkUsername(username) // expecting true
		if(!result){
			 return res.status(201).json({message:"Username not found"})
		}
		
		const credentialsValid = await bcrypt.compare(password, result.passwordhashed);
 		 if (!credentialsValid) {
			  return res.status(201).json({message:"Wrong password"})
 		}
 		const token = jwt.sign(
    		{
      			id: result.id,
      			username: result.username,
    		},
    			JWT_SECRET
  		);
 		return res.status(200).json({
 			id: result.id,
      			username: result.username,
 			token,
 		})
	}

	async checkUsername(username){
		try{
        const conn = await client.connect()
        const sql = 'SELECT * FROM USERS WHERE username = ($1)';
        const result = await conn.query(sql,[username])
        if(result.rows == false)
        	return false
	return result.rows[0]
	conn.release()
       } catch (error) {
                return error
       }

	}
}
