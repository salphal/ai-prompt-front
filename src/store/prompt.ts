import {create} from 'zustand';
import {createJSONStorage, persist} from "zustand/middleware";
import {setStoreProperties} from "@/utils/zustand.ts";
import {createSelectOptions} from "@/utils/antd/select.ts";
import {tableColumnBlackList} from "@/constants/table.ts";

export interface IPromptStore {
  /** 提示词数据 */
  dataSource: Array<any>;
  /** 列索引集合 */
  columnKeys: Array<any>;
  /** 提示词列表 */
  contextData: Array<any>;

  [key: string]: any
}

export const initialPromptData = {
  dataSource: [],
  selectedRowKeys: [],
  columnFilterValue: [],

  columnKeys: [],
  defaultRowData: {},
  contextData: [],

  formData: {}
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
      columnKeysOptions: () => createSelectOptions(get().columnKeys.filter((k: string) => !tableColumnBlackList.includes(k))),
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

export const setDataSource = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('dataSource', value, merge, insertBefore, isDeconstruct);

export const setDataSourceById = (id: any, value: any) =>
  setDataSource((prev: any) => (prev.map((v: any) => v.id === id ? {...v, ...value} : v)));

export const setDataSourceByMerge = (value: any) =>
  setDataSource((prev: any) => (prev.map((v: any) => ({...v, ...value}))));

export const setPromptContextById = (id: any, value: any) =>
  setDataSource((prev: any) => (prev.map((v: any) => v.id === id ? {...v, context: value} : v)));

export const resetDataSource = () =>
  setPromptProperty('dataSource', initialPromptData.dataSource, false);

export const setColumnFilterValue = (value: any, merge = false, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('columnFilterValue', value, merge, insertBefore, isDeconstruct);

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

export const setFormData = (value: any, merge = true, insertBefore = false, isDeconstruct = false) =>
  setPromptProperty('formData', value, merge, insertBefore, isDeconstruct);

export const resetPromptStore = () =>
  usePromptStore.setState({...initialPromptData});

export const clearPromptStoreStorage = () =>
  usePromptStore.persist.clearStorage();

export default usePromptStore;
