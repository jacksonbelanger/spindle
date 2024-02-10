require('dotenv').config();
const { Configuration, OpenAI } = require('openai');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const getAPIIdeas = require("getIdeas.js");
const createEndPoints = require("createEndpoints.js");
const createDocumentation = require("createDocumentation.js");


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
    const mongo_uri = req.body.mongo_uri
    const company = req.body.company
    const name = req.body.name
    
    if (!query) {
        return res.status(400).send({ error: 'No query provided' });
    }
    if (!schema) {
        return res.status(400).send({ error: 'No schema provided' });
    }
    if (!mongo_uri) {
        return res.status(400).send({ error: 'No mongo uri provided' });
    }
    if (!company) {
        return res.status(400).send({ error: 'No company provided' });
    }
    if (!name) {
        return res.status(400).send({ error: 'No name provided' });
    }

    let endpoint_ideas = await getAPIIdeas(schema, query);

    let endpoints = await createEndPoints(endpoint_ideas, schema);


    let doc_endpoints = await createEndPoints(endpoints, schema);




   


    // Generates endpoints from submitted schema
    try {
       
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send({ error: 'Error processing your request' });
    }


});

module.exports = router;
 