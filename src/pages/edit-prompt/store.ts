import { create } from 'zustand';
import { createJSONStorage, persist } from "zustand/middleware";
import {setStoreProperties} from "@/utils/zustand.ts";

export interface IEditPromptStore {
  [key: string]: any

  promptFormData: any;
}

export const initialEditPromptData = {
  editPromptData: {},
  promptFormData: {}
}

// useShallow(); 对象浅比较, 减少重绘
// const {
//  editPromptData,
// } = useEditPromptStore(useShallow((state: any) => state));
const useEditPromptStore = create(
  persist<IEditPromptStore>(
    (set, get) => ({
      ...initialEditPromptData
      // data: [],
      // setData: () => set(state => ({data: state.count})),
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: 'editPromptStore', // unique name
      version: 1,
      storage: createJSONStorage(() => localStorage), // localStorage | sessionStorage | ...
    },
  ),
);

export const setEditPromptStore = (props: any) =>
  useEditPromptStore.setState((prev: any) => ({...prev, ...props}));

export const setEditPromptProperty = (
  key: string,
  value: any,
  merge = true,
  insertBefore = false,
  isDeconstruct = false
) =>
  setStoreProperties(useEditPromptStore, key, value, merge, insertBefore, isDeconstruct);

export const setEditPromptData = (value: any, merge = true, insertBefore = false, isDeconstruct = false) =>
  setEditPromptProperty('editPromptData', value, merge, insertBefore, isDeconstruct);

export const setPromptFormData = (value: any, merge = true, insertBefore = false, isDeconstruct = false) =>
  setEditPromptProperty('promptFormData', value, merge, insertBefore, isDeconstruct);

export const resetEditPromptData = () =>
  setEditPromptProperty('editPromptData', initialEditPromptData.editPromptData, false);

export const resetEditPromptStore = () =>
  useEditPromptStore.setState({...initialEditPromptData});

export const clearEditPromptStoreStorage = () =>
  useEditPromptStore.persist.clearStorage();

export default useEditPromptStore;
