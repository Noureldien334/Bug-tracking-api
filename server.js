import express from 'express'
import http from 'http'
import bodyparser from 'body-parser'
import bugRoutess from './src/routes/users.js'
import bugRoutes from './src/routes/projects.js'
import memberRoutes from './src/routes/members.js'
import bugRoutesss from './src/routes/bugs.js'
import noteRoutes from './src/routes/notes.js'

const Port= 5000
const app = express()
const server =  http.createServer(app)
app.get('/', (req, res)=> {
	res.send("Hello")
})
app.use(bodyparser.json())
bugRoutes(app)
bugRoutess(app)
bugRoutesss(app)
memberRoutes(app)
noteRoutes(app)
server.listen(Port, () => {
	console.log(`Connected to Port ${Port}`)
	});
