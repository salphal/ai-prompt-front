export interface ZustandStore {
  setState: (...arg: any[]) => void
}

const isZustandObject = (target: any) => Object.prototype.toString.call(target) === '[object Object]'

const isZustandFunc = (target: any) => typeof target === 'function'

const isZustandArray = (target: any) => Array.isArray(target)

const isZustandStore = (store: any) => {
  return typeof store.name === 'string' && store.name === 'useBoundStore';
}

export const setStoreProperties = (
  store: ZustandStore | null = null,
  key: string,
  value: any,
  merge = true,
  insertBefore = false
) => {
  if (!store || !isZustandStore(store)) return
  if (isZustandObject(value)) {
    store.setState((prev: any) => ({
      ...prev,
      [key]: merge
        ? {...prev[key], ...value}
        : {...value}
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
}
