import client from '../../database.js'
import bcrypt from 'bcrypt'
import registerVal from '../validations/userVal.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import responseEnums from '../utils/repEnums.js'

export async function queryResult(sql,sqlParams,responseType){
  try{
    const conn = await client.connect()
    if(sqlParams === undefined)
      result = await conn.query(sql)
    else
      result = await conn.query(sql,sqlParams)
    console.log(result)
    conn.release()
    if(responseType == "ROWS")
      return result.responseEnums.ROWS 
    else if(responseType == "RESULT")
      return result
  } catch(error){
      return error
  }
}

