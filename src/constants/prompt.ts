import {ERole} from "@/typings/prompt.ts";

export enum PROMPT_CONTEXT_KEYS {
  role = 'role',
  content = 'content',
  data = 'data',
}

export const PROMPT_ROLES = [ERole.user, ERole.system, ERole.assistant];

export const PROMPT_CONTEXT_LABELS = {
  [PROMPT_CONTEXT_KEYS.role]: '角色',
  [PROMPT_CONTEXT_KEYS.content]: '内容',
  [PROMPT_CONTEXT_KEYS.data]: '辅助信息',
}

export enum PROMPT_MODEL_KEYS {
  name = 'name',
  model = 'model',
  temperature = 'temperature',
  max_tokens = 'max_tokens',
  presence_penalty = 'presence_penalty',
  frequency_penalty = 'frequency_penalty',
  sendMemory = 'sendMemory',
  historyMessageCount = 'historyMessageCount',
  compressMessageLengthThreshold = 'compressMessageLengthThreshold',
}

export const PROMPT_MODEL_LABELS = {
  [PROMPT_MODEL_KEYS.name]: '名称',
  [PROMPT_MODEL_KEYS.model]: '模型',
  [PROMPT_MODEL_KEYS.temperature]: '随机性',
  [PROMPT_MODEL_KEYS.max_tokens]: '单次回复限制',
  [PROMPT_MODEL_KEYS.presence_penalty]: '话题新鲜度',
  [PROMPT_MODEL_KEYS.frequency_penalty]: '频率惩罚度',
  [PROMPT_MODEL_KEYS.sendMemory]: '自动压缩聊天记录',
  [PROMPT_MODEL_KEYS.historyMessageCount]: '附带历史消息数',
  [PROMPT_MODEL_KEYS.compressMessageLengthThreshold]: '压缩消息长度阈值',
}

export enum PROMPT_ITEM_KEYS {
  id = 'id',
  avatar = 'avatar',
  name = 'name',
  context = 'context',
  modelConfig = 'modelConfig',
  lang = 'lang',
  builtin = 'builtin',
}

export const PROMPT_ITEM_LABELS = {
  [PROMPT_ITEM_KEYS.id]: 'id',
  [PROMPT_ITEM_KEYS.avatar]: '用户头像',
  [PROMPT_ITEM_KEYS.name]: '角色名称',
  [PROMPT_ITEM_KEYS.context]: '模型提示词上下文',
  [PROMPT_ITEM_KEYS.modelConfig]: '模型配置信息',
  [PROMPT_ITEM_KEYS.lang]: '语言',
  [PROMPT_ITEM_KEYS.builtin]: '是否内置的 Prompt',
}

export const PROMPT_MODELS = [
  'gpt-3.5-turbo-16k-0613',
  'gpt-3.5-turbo-16k',
]
