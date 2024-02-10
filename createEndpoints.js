const ChatOpenAI = require("@langchain/openai").ChatOpenAI;
const JsonOutputFunctionsParser = require("langchain/output_parsers").JsonOutputFunctionsParser;
const HumanMessage = require("@langchain/core/messages").HumanMessage;
const dotenv= require('dotenv')

dotenv.config()

// Instantiate the parser
const parser = new JsonOutputFunctionsParser();

const completed_endpoints = []

// Define the function schema
const extractionFunctionSchema = {
  name: "endpointcreator",
  description: "Creates POST API Endpoint Functionality From API Idea and Mongo Schema",
  parameters: {
    type: "object",
    properties: {
      endpoint: {
        type: "string",
        description: "The API endpoint path",
      },
      code: {
        type: "string",
        description: "The NodeJS code for the inner logic of the API. This only includes the Mongo queries, not the express wrapper. You cannot use the response or requests objects. Refer to parameters as their variable names. The final output is saved as the variable called answer. Emit all control characters.",
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
                }
            }
         },
        description: "array of the parameters names and types",


      }
    },
    required: ["endpoint", "code", "params"],
  },
};

// Instantiate the ChatOpenAI class
const model = new ChatOpenAI({ modelName: "gpt-4", maxTokens:2500, temperature:1.07});

// Create a new runnable, bind the function to the model, and pipe the output through the parser
const runnable = model
  .bind({
    functions: [extractionFunctionSchema],
    function_call: { name: "endpointcreator" },
  })
  .pipe(parser);


async function createEndpoint(endpoint, schema){
    try{
const result = await runnable.invoke([
  new HumanMessage(`Create an API from this API idea : 
  ${endpoint}
    This is the schema: 
    ${schema}
    `)

    
]
);
return result

    } catch(e){
        return null;
    }

}

async function createEndpoints(endpoints, schema){
    const returnArr = []
    for(let endpoint of endpoints){
        let new_endpoint = await createEndpoints(endpoint, schema)
        if(new_endpoint)
            returnArr.push(new_endpoint)
    }

    return returnArr
}




module.exports = createEndpoints


/**
{
  result: {
    tone: 'positive',
    word_count: 4,
    chat_response: "Indeed, it's a lovely day!"
  }
}
 */