import {create} from 'zustand';
import {createJSONStorage, persist} from "zustand/middleware";
import {setStoreProperties} from "@/utils/zustand.ts";

export interface IHomeStore {
  [key: string]: any
}

export const initialHomeData = {
  homeData: {},
  homeFormData: {},
}

// useShallow(); 对象浅比较, 减少重绘
// const {
//  homeData,
// } = useHomeStore(useShallow((state: any) => state));
const useHomeStore = create(
  persist<IHomeStore>(
    (set, get) => ({
      ...initialHomeData
      // data: [],
      // setData: () => set((state) => ({foo: "bar"})), // 将返回的对象与之前的对象合并
      // getData: () => get().data.map((v: any) => !!v),
    }),
    {
      name: 'homeStore', // unique name
      version: 1,
      storage: createJSONStorage(() => localStorage), // localStorage | sessionStorage | ...
    },
  ),
);

export const setHomeStore = (props: any) =>
  useHomeStore.setState((prev: any) => ({...prev, ...props}));

export const setHomeProperty = (
  key: string,
  value: any,
  merge = true,
  insertBefore = false,
  isDeconstruct = false
) =>
  setStoreProperties(useHomeStore, key, value, merge, insertBefore, isDeconstruct);

export const setHomeData = (value: any, merge = true, insertBefore = false, isDeconstruct = false) =>
  setHomeProperty('homeData', value, merge, insertBefore, isDeconstruct);

export const setHomeFormData = (value: any, merge = true, insertBefore = false, isDeconstruct = false) =>
  setHomeProperty('homeFormData', value, merge, insertBefore, isDeconstruct);

export const resetHomeData = () =>
  setHomeProperty('homeData', initialHomeData.homeData, false);

export const resetHomeStore = () =>
  useHomeStore.setState({...initialHomeData});

export const clearHomeStoreStorage = () =>
  useHomeStore.persist.clearStorage();

export default useHomeStore;
