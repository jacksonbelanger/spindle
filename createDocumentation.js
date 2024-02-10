const ChatOpenAI = require("@langchain/openai").ChatOpenAI;
const JsonOutputFunctionsParser = require("langchain/output_parsers").JsonOutputFunctionsParser;
const HumanMessage = require("@langchain/core/messages").HumanMessage;
const dotenv= require('dotenv')

dotenv.config()

// Instantiate the parser
const parser = new JsonOutputFunctionsParser();

const completed_endpoints = []

// Define the function schema
const doc_endpointSchema = {
  name: "docendpointcreator",
  description: "Creates Documentation for POST API Endpoint Functionality From API Idea and Mongo Schema",
  parameters: {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "Name of the endpoints."
        },
        api_description: {
            type: "string",
            description: "This should be a detailed description of the functions of the API."
        },
      endpoint: {
        type: "string",
        description: "The API endpoint path",
      },
      tags: {
        type: "array",
        items: {
            type: "string",
            description:"Tags that describe the endpoint."
            
        }
      },
      params:{
        type:"array",
        items: {
            type: "object",
            properties :{
                name: {
                    type:"string",
                    description:"name of the parameter"
                },
                type:{
                    type:"string",
                    description:"type of the parameter"
                }, 
                description: {
                    type:"string",
                    description:"this shortly describes the use case of the parameter for this function."
                }
            }
         }
      }
    },

    required: ["name", "endpoint", "tags", "params", "api_description"],
  },
};

// Instantiate the ChatOpenAI class
const model = new ChatOpenAI({ modelName: "gpt-4", maxTokens:2000});

// Create a new runnable, bind the function to the model, and pipe the output through the parser
const runnable = model
  .bind({
    functions: [doc_endpointSchema],
    function_call: { name: "docendpointcreator" },
  })
  .pipe(parser);


async function createDocEndpoint(endpoint, schema){
    try{
const result = await runnable.invoke([
  new HumanMessage(`Create an documentation for the endpoints from this API idea : 
  ${endpoint}
    This is the schema: 
    ${schema}
    `)
]
);

return result;

    } catch(e){
        return null;
    }

}



async function createDocEndPoints(endpoints, schema){
    let returnArr =[]
    for(let endpoint of endpoints){
        let new_endpoint = await createDocEndpoint(endpoint, schema)
        if(new_endpoint){
            returnArr.push(new_endpoint)
        }
    }

    return returnArr;
}



module.exports = createDocEndPoints