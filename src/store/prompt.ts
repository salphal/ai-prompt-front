import { create } from 'zustand';
import {setStoreProperties} from "@/utils/prompt.ts";

export interface IPromptStore {
  [key: string]: any
}

export const initialPromptData = {
  promptData: {},
}

// useShallow(); 对象浅比较, 减少重绘
// const {
//  promptData,
// } = usePromptStore(useShallow((state: any) => state));
const usePromptStore = create<IPromptStore>((set, get) => ({
  ...initialPromptData
}));

export const setPromptStore = (props: any) =>
  usePromptStore.setState((prev: any) => ({...prev, ...props}));

export const setPromptProperty = (key: string, value: any, merge = true, insertBefore = false) => {
  setStoreProperties(usePromptStore, key, value, merge, insertBefore);
};

export const setPromptData = (obj: any, merge = true) =>
  setPromptProperty('promptData', obj, merge);

export const resetPromptData = () =>
  setPromptProperty('promptData', initialPromptData.promptData, false);

export const resetPromptStore = () =>
  usePromptStore.setState({...initialPromptData});

export default usePromptStore;
