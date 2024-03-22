import {PROMPT_ITEM_KEYS, PROMPT_ITEM_LABELS, PROMPT_MODEL_KEYS} from "@/constants/prompt.ts";
import Mock from "mockjs";

export enum TABLE_KEYS {
  model = 'model',
  temperature = 'temperature',
  max_tokens = 'max_tokens',
  presence_penalty = 'presence_penalty',
  frequency_penalty = 'frequency_penalty',
  sendMemory = 'sendMemory',
  historyMessageCount = 'historyMessageCount',
  compressMessageLengthThreshold = 'compressMessageLengthThreshold',
}

export const TABLE_LABELS = {
  [PROMPT_MODEL_KEYS.model]: '模型',
  [PROMPT_MODEL_KEYS.temperature]: '随机性',
  [PROMPT_MODEL_KEYS.max_tokens]: '单次回复限制',
  [PROMPT_MODEL_KEYS.presence_penalty]: '话题新鲜度',
  [PROMPT_MODEL_KEYS.frequency_penalty]: '频率惩罚度',
  [PROMPT_MODEL_KEYS.sendMemory]: '是否自动压缩聊天记录',
  [PROMPT_MODEL_KEYS.historyMessageCount]: '附带历史消息数',
  [PROMPT_MODEL_KEYS.compressMessageLengthThreshold]: '压缩消息长度阈值',
}

export const tableMockData = Mock.mock(() => {
  return Mock.mock({
    'tableData|50': [{
      [`key|+1`]: 0,
      [TABLE_KEYS.model]: 'gpt-3.5-turbo-16k', // 模型
      [TABLE_KEYS.temperature]: 0.7, // 温度
      [TABLE_KEYS.max_tokens]: 64, // 最大标记数
      [TABLE_KEYS.presence_penalty]: 0.8, // 存在惩罚值
      [TABLE_KEYS.frequency_penalty]: 1.0, // 频率惩罚值
      [TABLE_KEYS.sendMemory]: 1, // 发送内存
      [TABLE_KEYS.historyMessageCount]: 10, // 历史消息计数
      [TABLE_KEYS.compressMessageLengthThreshold]: 200, // 压缩消息长度阈值
    }]
  }).tableData;
});

export const TABLE_COLUMNS = [
  {
    key: PROMPT_ITEM_KEYS.name,
    dataIndex: PROMPT_ITEM_KEYS.name,
    title: PROMPT_ITEM_LABELS.name,
    width: 200,
  },
  {
    key: TABLE_KEYS.model,
    dataIndex: TABLE_KEYS.model,
    title: TABLE_LABELS.model,
    width: 200,
  },
  {
    key: TABLE_KEYS.temperature,
    dataIndex: TABLE_KEYS.temperature,
    title: TABLE_LABELS.temperature,
    width: 200,
  },
  {
    key: TABLE_KEYS.max_tokens,
    dataIndex: TABLE_KEYS.max_tokens,
    title: TABLE_LABELS.max_tokens,
    width: 200,
  },
  {
    key: TABLE_KEYS.presence_penalty,
    dataIndex: TABLE_KEYS.presence_penalty,
    title: TABLE_LABELS.presence_penalty,
    width: 200,
  },
  // {
  //   key: TABLE_KEYS.frequency_penalty,
  //   dataIndex: TABLE_KEYS.frequency_penalty,
  //   title: TABLE_LABELS.frequency_penalty,
  //   width: 200,
  // },
  {
    key: TABLE_KEYS.sendMemory,
    dataIndex: TABLE_KEYS.sendMemory,
    title: TABLE_LABELS.sendMemory,
    width: 200,
    render: (v: any) => (v ? '是' : '否'),
  },
  {
    key: TABLE_KEYS.historyMessageCount,
    dataIndex: TABLE_KEYS.historyMessageCount,
    title: TABLE_LABELS.historyMessageCount,
    width: 200,
  },
  {
    key: TABLE_KEYS.compressMessageLengthThreshold,
    dataIndex: TABLE_KEYS.compressMessageLengthThreshold,
    title: TABLE_LABELS.compressMessageLengthThreshold,
    width: 200,
  },
];
