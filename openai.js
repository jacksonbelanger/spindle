require('dotenv').config();
const { Configuration, OpenAI } = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Initialize OpenAI API
const openai = new OpenAI(OPENAI_API_KEY);

const express = require('express');
const router = express.Router()


router.use(express.json());

/**
 * Returns JSON for an endpoint
 */
router.post('/generateAPI', async (req, res) => {
    console.log("generateAPI endpoint has been hit");
    const query = req.body.query;
    const schema = req.body.schema;

    if (!query) {
        return res.status(400).send({ error: 'No query provided' });
    }
    if (!schema) {
        return res.status(400).send({ error: 'No schema provided' });
    }

    // prompt to generate api and endpoint
    const prompt = `The user message in an input that is a MongoDB model. 

    Using this Model, generate Post API descriptions in this format. These should be read only functionality apis where the data is in the response. The code should be expressjs code for node. 
    
    {“endpoint”: “endpoint/get/functionality_name”,
    “params” : [{‘name’:’location’, ‘type’:’string’]}
    ‘code”:”output code”
    }

    Could you not give me text between JSON files? Don't me comments between each functionality.`;

    try {
        const gptResponse = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-4',
            max_tokens: 4096
          });

          console.log(gptResponse.choices[0].message.content)

        res.send(gptResponse.choices[0].message.content);
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send({ error: 'Error processing your request' });
    }
});

module.exports = router;
 