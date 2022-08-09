import express from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import NextFunction from 'express'
dotenv.config({path:"../../.env"})


const{
    JWT_SECRET
} = process.env

const authChecker = async (req, res, next) => {
	
	try {
	 const token = req.header('jwt-token')

	 if(!token){
	  return res
	  	 .status(401)
	  	 .send({message:"No auth token found"})
	 }
	const fetchedToken = jwt.verify(token, process.env.JWT_SECRET)
	if(!fetchedToken.id) {
		return res
		       .status(401)
		       .send({message:"Token verification failed"})
	}
	req.user = fetchedToken.id;
	next()
	} catch (err){
		return res.status(500).send({message:err.message})
	}
	
}
export default authChecker;
