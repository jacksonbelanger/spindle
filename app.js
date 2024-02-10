const express = require('express')
const app = express()
const port = 3001
const openAIRouter = require("./openai.js");


// receive hashed mongo URI 

app.use('/openai', openAIRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

