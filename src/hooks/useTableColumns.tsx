import {useEffect, useMemo, useState} from "react";
import TextOverflowTip from "@/components/text-overflow-tip";
import JsonViewer from "@/components/json-viewer";
import {HolderOutlined} from "@ant-design/icons";


export interface IUseTableColumnsProps {
  /** 表格配置 */
  columns?: Array<any>;
  /** 表格数据 */
  tableData?: Array<any>;
  /** 操作列 */
  operations?: any;
  /** 索引列 */
  indexAble?: boolean;
  /** 拖拽列 */
  dragAble?: boolean;
  /** 操作列 */
  operationAble?: boolean;

  [key: string]: any;
}

const useTableColumns = (props: IUseTableColumnsProps = {}) => {

  const {
    tableData,
    columns,
    indexAble = false,
    dragAble = false,
    operationAble = false,
    operations = {}
  } = props;

  const [rowData, setRowData] = useState<any>({});
  const [tableColumnKeys, setTableColumnKeys] = useState<Array<string>>([]);
  const [tableColumnBlackKeys, setTableColumnBlackKeys] = useState<Array<string>>([]);

  useEffect(() => {
    let columnKeys = [];
    if (Array.isArray(columns) && columns.length) {
      columnKeys = columns.map(column => column.dataIndex);
    }
    if (Array.isArray(tableData) && tableData.length) {
      let rowData: any = {};

      tableData.forEach((v => rowData = {...rowData, ...v}));

      setRowData(rowData);
      columnKeys = Object.keys(rowData);
    }
    setTableColumnKeys(columnKeys);
  }, [columns, tableData]);

  const tableColumns = useMemo(() => () => {

    let tableColumns = [];

    /** 排序列 */
    const sortColumn = {
      key: "table-sort-column",
      align: "center",
      width: 80,
      render: () => <HolderOutlined/>
    };

    /** 索引列 */
    const indexColumn = {
      key: "table-index-column",
      title: "No",
      width: 80,
      render: (_: any, __: any, i: number) => i
    };

    /** 操作列 */
    const operationsColumn = {
      key: "table-operations-column",
      title: "operations",
      width: 240,
      fixed: "right" as any,
      ...operations
    };

    if (Array.isArray(columns) && columns.length) {
      tableColumns = columns;
    } else if (Array.isArray(tableData) && tableData.length) {
      tableColumns = createTableColumns(rowData)
        .filter((v: any) => tableColumnBlackKeys.includes(v.dataIndex));
    }

    if (tableColumns.length) {
      if (dragAble) tableColumns.unshift(sortColumn);
      if (indexAble) tableColumns.unshift(indexColumn);
      if (operationAble) tableColumns.push(operationsColumn);
      return tableColumns;
    }

    return [];

  }, [columns, tableData, tableColumnBlackKeys, rowData]);

  const createTableColumns = (obj: { [key: string]: any }) => {
    if (!Object.keys(obj).length) return [];
    return Object.entries(obj)
      .map(([key, val]) => {
        const config = {
          key: key,
          dataIndex: key,
          title: key,
          width: 200
          // valueType: typeof val !== 'object' ? 'text' : 'input'
        };
        return {
          ...config,
          render: (text: any, record: any, index: number) => renderColumn(config, text, record, index)
        };
      });
  };

  const renderColumn = (config: any, text: any, record: any, index: number) => {
    if ((typeof text === "object" && text !== null)) {
      return renderJsonView(text, config);
    }
    return renderTextColumn(text, config);
  };

  const renderJsonView = (text: any, config: any) =>
    <TextOverflowTip
      width={config.width}
      popRender={() => <JsonViewer name={config.dataIndex} src={text}/>}
      popAble
    >{JSON.stringify(text)}</TextOverflowTip>;

  const renderTextColumn = (text: any, config: any) =>
    <TextOverflowTip width={config.width}>{String(text)}</TextOverflowTip>;

  return {
    rowData,
    setRowData,
    tableColumnKeys,
    setTableColumnKeys,
    tableColumnBlackKeys,
    setTableColumnBlackKeys,
    tableColumns: tableColumns()
  };
};

export default useTableColumns;
