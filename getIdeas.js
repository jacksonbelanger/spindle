const OpenAI = require("@langchain/openai").OpenAI;
const PromptTemplate = require("@langchain/core/prompts").PromptTemplate;
const CommaSeparatedListOutputParser = require("@langchain/core/output_parsers").CommaSeparatedListOutputParser;
const RunnableSequence = require("@langchain/core/runnables").RunnableSequence;
const dotenv= require('dotenv')

dotenv.config()

const getAPIIdeas = async (schema, query) => {
  // With a `CommaSeparatedListOutputParser`, we can parse a comma separated list.
  const parser = new CommaSeparatedListOutputParser();

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate("Create as many APIs as you can based on the given MongoDB Schema. They must all be read only and must all be POST based APIs. This is the schema: {schema}. Here are user requested APIs to give you a place to start from {query}\n{format_instructions}"),
    new OpenAI({ temperature: 1.0, maxTokens:3000, modelName: "gpt-3.5-turbo-0125" }),
    parser,
  ]);

  console.log("running chain")

  const response = await chain.invoke({
    schema: schema,
    format_instructions: "Return a javascript array.",
    query:query
  });

  return response



};

module.exports = getAPIIdeas

