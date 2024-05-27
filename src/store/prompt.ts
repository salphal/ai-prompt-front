import {create} from 'zustand';
import {createJSONStorage, persist} from "zustand/middleware";
import {setStoreProperties} from "@/utils/zustand.ts";
import {createSelectOptions} from "@/utils/antd/select.ts";

export interface IPromptStore {
  /** 提示词数据 */
  promptData: Array<any>;
  /** 列索引集合 */
  columnKeys: Array<any>;
  /** 提示词列表 */
  contextData: Array<any>;

  [key: string]: any
}

export const initialPromptData = {
  promptData: [],
  selectedRowKeys: [],

  columnKeys: [],
  defaultRowData: {},
  contextData: [],

  filterColumnKey: "",
  filterCondition: ""
}

// useShallow(); 对象浅比较, 减少重绘
// const {
//  promptData,
// } = usePromptStore(useShallow((state: any) => state));
const usePromptStore = create(
  persist<IPromptStore>(
    (set, get) => ({
      ...initialPromptData,
      // data: [],
      // setData: () => set(state => ({data: state.count})),
      // getData: () => get().data.map((v: any) => !!v),
      columnKeysOptions: () => createSelectOptions(get().columnKeys),
      contextKeysOptions: () => {
        const contextData = get().contextData;
        if (!Array.isArray(contextData) || !contextData.length) return [];
        return createSelectOptions(Object.keys(get().contextData[0]));
      },
      promptColumns: () => {
      },
    }),
    {
      name: 'promptStore', // unique name
      version: 1,
      storage: createJSONStorage(() => localStorage), // localStorage | sessionStorage | ...
    },
  ),
);

export const setPromptStore = (props: any) =>
  usePromptStore.setState((prev: any) => ({...prev, ...props}));

export const setPromptProperty = (
  key: string,
  value: any,
  merge = true,
  insertBefore = false,
  isDeconstruct = false
) =>
  setStoreProperties(usePromptStore, key, value, merge, insertBefore, isDeconstruct);

export const setPromptData = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('promptData', value, merge, insertBefore, isDeconstruct);

export const setPromptDataById = (id: any, value: any) =>
  setPromptData((prev: any) => (prev.map((v: any) => v.id === id ? {...v, ...value} : v)));

export const setPromptDataByMerge = (value: any) =>
  setPromptData((prev: any) => (prev.map((v: any) => ({...v, ...value}))));

export const setPromptContextById = (id: any, value: any) =>
  setPromptData((prev: any) => (prev.map((v: any) => v.id === id ? {...v, context: value} : v)));

export const resetPromptData = () =>
  setPromptProperty('promptData', initialPromptData.promptData, false);

export const setColumnKeys = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('columnKeys', value, merge, insertBefore, isDeconstruct);

export const resetColumnKeys = () =>
  setPromptProperty('columnKeys', initialPromptData.columnKeys, false);

export const setContextData = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('contextData', Array.isArray(value) ? value : [], merge, insertBefore, isDeconstruct);

export const resetContextData = () =>
  setPromptProperty('contextData', initialPromptData.contextData, false);

export const setSelectedRowKeys = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('selectedRowKeys', Array.isArray(value) ? value : [], merge, insertBefore, isDeconstruct);

export const resetSelectedRowKeys = () =>
  setPromptProperty('selectedRowKeys', initialPromptData.selectedRowKeys, false);

export const setDefaultRowData = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('defaultRowData', value, merge, insertBefore, isDeconstruct);

export const resetDefaultRowData = () =>
  setPromptProperty('defaultRowData', initialPromptData.defaultRowData, false);

export const setFilterColumnKey = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('filterColumnKey', value, merge, insertBefore, isDeconstruct);

export const setFilterCondition = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('filterCondition', value, merge, insertBefore, isDeconstruct);

export const resetPromptStore = () =>
  usePromptStore.setState({...initialPromptData});

export const clearPromptStoreStorage = () =>
  usePromptStore.persist.clearStorage();

export default usePromptStore;
