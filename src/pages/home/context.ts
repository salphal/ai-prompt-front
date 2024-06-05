import { Context, createContext } from 'react';

export interface IHomeContext {
  [key: string]: any;
}

const initialHomeContext: IHomeContext = {};

const HomeContext: Context<IHomeContext> = createContext<IHomeContext>(initialHomeContext);

export const HomeContextProvider = HomeContext.Provider;

export const HomeContextConsumer = HomeContext.Consumer;

export default HomeContext;
