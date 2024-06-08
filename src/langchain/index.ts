import { ChatOpenAI } from 'langchain/chat_models/openai'
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { BaseOutputParser } from 'langchain/schema/output_parser'

// import { HumanMessage } from 'langchain/schema'

/**
 * Parse the output of an LLM call to a comma-separated list.
 */
class CommaSeparatedListOutputParser extends BaseOutputParser<string[]> {
  lc_namespace: string[]

  async parse(text: string): Promise<string[]> {
    return text.split(',').map(item => item.trim())
  }

  // 此抽象接口未使用但是必须有默认实现
  getFormatInstructions(): string {
    return ''
  }
}

// 示例模板字符串
// const popupTemplate = `
// You are a helpful assistant specialized in doing many things.
// Now, you need to {text}.
// Please make sure to always provide information that is high.
// `

const chatTemplate = `
You are a helpful assistant specialized in chating with people.
`

const chatPrompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(chatTemplate),
  HumanMessagePromptTemplate.fromTemplate('{text}'),
])

const model = new ChatOpenAI({
  // maxTokens: 25,
  streaming: true,
  temperature: 0.7,
  // 使用自己申请的，这里展示的是错误的
  openAIApiKey: 'sk-f2j0Zh9WxD8HPdlOcDu5tTRDQhWJaOV86nx3CiDsl7BTQWzo',
  configuration: {
    // ChatOpenAI 的请求拼接 path 是 /chat/completions ，需要根据完整的请求 url 裁剪得到 baseURL
    baseURL: 'https://api.f2gpt.com',
    defaultHeaders: {
      'Content-Type': 'application/json',
    },
  },
  // callbacks: [
  //   {
  //     handleLLMStart: async (llm: { name: string }, prompts: string[]) => {
  //       console.log('llm',JSON.stringify(llm, null, 2));
  //       console.log('prompts',JSON.stringify(prompts, null, 2));
  //     },
  //     handleLLMEnd: async (output: LLMResult) => {
  //       console.log('output',JSON.stringify(output, null, 2));
  //     },
  //     handleLLMError: async (err: Error) => {
  //       console.error(err);
  //     },
  //   },
  // ],
})

export const chain = chatPrompt.pipe(model).pipe(new CommaSeparatedListOutputParser())
