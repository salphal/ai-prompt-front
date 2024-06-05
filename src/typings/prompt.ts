export enum ERole {
  user = 'user', // 用户( 输入 ): 代表了用户, 也就是与 AI 对话的人, 用户的输入通常是问题，请求或者指令;
  system = 'system', // 系统( 上下文 ): 设置对话的上下文, 或者给 AI 提供特定的指令, 这些指令对于用户是不可见的, 但可以影响 AI 的行为;
  assistant = 'assistant', // 助手( 输出 ): 代表了 AI助手，也就是 AI 的输出, 这通常是对用户输入的回应;
}

export interface IPromptContextItem {
  role: typeof ERole; // 角色: system: 输入, user: 输出, assistant: 上下文
  content: string; // 内容: 上下文的具体内容
  data: string; // 辅助信息: 影响对话中的功能和决策
}

export interface IPromptModelConfig {
  model: string; // √ 指定使用 openai 的哪个模型
  temperature: number; // √ [0,1], 0.5 随机性( 值越大, 回复越随机 )
  max_tokens: number; // √ [0,16385], 16385 单次回复最大字符数
  presence_penalty: number; // √ [-2,2], 2 话题新鲜度( 值越大，约有可能扩展到新话题 )
  frequency_penalty: number; // √ [-2,2], 2 话题新鲜度( 值越大，约有可能降低重复字 )
  sendMemory: boolean; // √ 是否自动压缩聊天记录，并作为上下文发送
  historyMessageCount: number; // √ [0,100], 100 附带历史消息数
  compressMessageLengthThreshold: number; // √ [0,1000], 1000 压缩消息长度阈值
}

export type TPromptContext = IPromptContextItem[];

export interface IPromptItem {
  id: string; // √ 唯一 ID
  avatar: string; // √ 角色头像
  name: string; // √ 角色名称
  context: TPromptContext; // 模型提示词上下文
  modelConfig: IPromptModelConfig; // 模型配置信息
  lang: string; // X 语言
  builtin: boolean; // X 是否内置的 prompt
}

export type TPrompt = IPromptItem[];
