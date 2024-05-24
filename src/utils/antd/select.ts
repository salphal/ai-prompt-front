export const selectFilterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export const createSelectOptions = (data: Array<any>) =>
  (Array.isArray(data) && data.length) ?
    data.map((k: any) => ({label: k, value: k})) : [];
