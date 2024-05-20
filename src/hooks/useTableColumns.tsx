import {useMemo} from "react";
import TextOverflowTip from "@/components/text-overflow-tip";
import {deconstructObject} from "@/utils/format.ts";

export interface IUseTableColumnsProps {
	[key: string]: any;

	columns?: Array<any>;
	tableData?: Array<any>;
	operations?: any;
}

const useTableColumns = (props: IUseTableColumnsProps = {}) => {

	const {
		tableData,
		columns,
		operations = {}
	} = props;

	const tableColumns = useMemo(() => () => {

		let tableColumns = [];

		const operationsColumn = {
			key: 'table-operations-column',
			title: '操作',
			width: 200,
			fixed: 'right' as any,
			render: (v: any) => v,
			...operations
		};

		if (Array.isArray(columns) && columns.length) {
			tableColumns = columns;
		}

		if (Array.isArray(tableData) && tableData.length) {
			const firstRowData = tableData[0];
			const obj = deconstructObject(firstRowData);
			const columns = createTableColumns(obj);
			console.log("=>(useTableColumns.tsx:47) columns", columns);
			tableColumns = columns;
		}

		const blackList = ['id'];
		tableColumns = tableColumns.filter((v => !blackList.includes(v.dataIndex)));

		return [...tableColumns, operationsColumn];

	}, [tableData]);

	const createTableColumns = (obj: { [key: string]: any }) => {
		if (!Object.keys(obj).length) return [];
		return Object.keys(obj)
			.map(v => ({
				key: v,
				dataIndex: v,
				title: v,
				width: 200,
				render: (v: any) => String(v)
			}));
	};

	const renderTextColumn = (v: any) => <TextOverflowTip width={v.width}>{v}</TextOverflowTip>;

	return {
		tableColumns: tableColumns()
	};
};

export default useTableColumns;
