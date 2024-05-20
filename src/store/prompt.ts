import {create} from 'zustand';
import {createJSONStorage, persist} from "zustand/middleware";
import {setStoreProperties} from "@/utils/zustand.ts";

export interface IPromptStore {
	[key: string]: any
}

export const initialPromptData = {
	promptData: [],
}

// useShallow(); 对象浅比较, 减少重绘
// const {
//  promptData,
// } = usePromptStore(useShallow((state: any) => state));
const usePromptStore = create(
	persist<IPromptStore>(
		(set, get) => ({
			...initialPromptData
		}),
		{
			name: 'promptStore', // unique name
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

export const setPromptData = (value: any, merge = true, insertBefore = false, isDeconstruct = false) =>
	setPromptProperty('promptData', value, merge, insertBefore, isDeconstruct);

export const resetPromptData = () =>
	setPromptProperty('promptData', initialPromptData.promptData, false);

export const resetPromptStore = () =>
	usePromptStore.setState({...initialPromptData});

export default usePromptStore;
