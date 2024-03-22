import {PROMPT_MODEL_KEYS, PROMPT_MODELS} from "@/constants/prompt.ts";

export const defaultFormData = {
  [PROMPT_MODEL_KEYS.model]: PROMPT_MODELS[0],
  [PROMPT_MODEL_KEYS.temperature]: .5,
  [PROMPT_MODEL_KEYS.max_tokens]: 16385,
  [PROMPT_MODEL_KEYS.presence_penalty]: 0,
  [PROMPT_MODEL_KEYS.frequency_penalty]: 0,
  [PROMPT_MODEL_KEYS.sendMemory]: true,
  [PROMPT_MODEL_KEYS.compressMessageLengthThreshold]: 1000,
};
