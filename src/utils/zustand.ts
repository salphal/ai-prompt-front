import { StateStorage } from "zustand/middleware";

export interface ZustandStore {
  setState: (...arg: any[]) => void
}

/** 若存入的不是 object 类型, 而是自定义类, 则展开运算可能会导致私有成员丢失 */
const isZustandObject = (target: any) => Object.prototype.toString.call(target) === '[object Object]'

const isZustandFunc = (target: any) => typeof target === 'function'

const isZustandArray = (target: any) => Array.isArray(target)

const isZustandStore = (store: any) => {
  return typeof store.name === 'string' && store.name === 'useBoundStore';
}

/**
 * @param store {ZustandStore | null} - ZustandStore 实例
 * @param key {string} - 数据名
 * @param value {any} - 数据值
 * @param merge {boolean} - 是否和之前的该值合并
 * @param insertBefore {boolean} - 如果该数据为数组, 是否从前面插入数据
 * @param isDeconstruct {boolean} - 是否使用结构数据合并值
 *    - 会保证每次都是一个新的引用地址
 *    - 注意: 会失去解构对象上的私有成员
 */
export const setStoreProperties = (
    store: ZustandStore | null = null,
    key: string,
    value: any,
    merge = true,
    insertBefore = false,
    isDeconstruct = false
) => {
  if (!store || !isZustandStore(store)) return
  /** 解决解构丢失私有成员 */
  if (!isDeconstruct) {
    store.setState((prev: any) => ({
      ...prev,
      [key]: value
    }));
    return
  }
  if (isZustandObject(value)) {
    store.setState((prev: any) => ({
      ...prev,
      [key]: merge
          ? { ...prev[key], ...value }
          : { ...value }
    }))
  } else if (isZustandArray(value)) {
    store.setState((prev: any) => ({
      ...prev,
      [key]: merge
          ? !insertBefore
              ? [...prev[key], ...value]
              : [...value, ...prev[key]]
          : value
    }))
  } else if (isZustandFunc(value)) {
    store.setState((prev: any) => ({
      ...prev,
      [key]: value(prev[key])
    }))
  }
};

/** custom zustand save methods */
export const zustandLocalStorage: StateStorage = {
  getItem: (key): string => {
    return JSON.parse(localStorage.getItem(key) as string)
  },
  setItem: (key, newValue): void => {
    localStorage.setItem(key, JSON.stringify(newValue))
  },
  removeItem: (key): void => {
    localStorage.removeItem(key);
  }
};
