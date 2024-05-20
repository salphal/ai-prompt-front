import {isObject} from "lodash";

export const deconstructObject = (obj: { [key: string]: any }) => {
	const result: any = {};

	for (const key in obj) {
		const value = obj[key];

		if (isObject(value)  && value !== null) {

			if (Array.isArray(value)) {
				result[key] = JSON.stringify(value);
			} else {
				const flattened = deconstructObject(value);
				for (const subKey in flattened) {
					result[key + '.' + subKey] = flattened[subKey];
				}
			}

		} else {
			result[key] = value;
		}
	}

	return result;
}
