const express = require('express')
const app = express()
const port = 3001
const openAIRouter = require("./openai.js");
const mongouri = require("./mongouri.js");

dotenv.config();

// receive hashed mongo URI 

app.use('/mongoDB', mongouri)

app.use('/openai', openAIRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

