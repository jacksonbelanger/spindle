const express = require('express')
const app = express()
const port = 3001
const openAIRouter = require("./openai.js");
const mongouri = require("./mongouri.js");
const dotenv = require('dotenv')
const apiRouter = require("./api.js")



var cors = require('cors')




dotenv.config();

// receive hashed mongo URI 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/mongoDB', mongouri)

app.use('/openai', openAIRouter)
app.use('/api', apiRouter)


app.listen(port, () => {
  console.log(`Server is starting on port:  ${port}`)
})

