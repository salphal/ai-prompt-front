import {useEffect, useMemo, useState} from "react";
import TextOverflowTip from "@/components/text-overflow-tip";
import JsonViewer from "@/components/json-viewer";
import {setColumnKeys} from "@/store/prompt.ts";
import {HolderOutlined} from "@ant-design/icons";

export interface IUseTableColumnsProps {
  columns?: Array<any>;
  tableData?: Array<any>;
  operations?: any;

  [key: string]: any;
}

const useTableColumns = (props: IUseTableColumnsProps = {}) => {

  const {
    tableData,
    columns,
    operations = {}
  } = props;

  const [filterColumns, setFilterColumns] = useState<Array<any>>([]);

  useEffect(() => {
    let columnKeys = [];

    if (Array.isArray(columns) && columns.length) {
      columnKeys = columns.map(column => column.dataIndex);
    }

    if (Array.isArray(tableData) && tableData.length) {
      columnKeys = Object.keys(tableData[0]);
    }

    setFilterColumns(columnKeys);
    setColumnKeys(columnKeys);
  }, [columns, tableData]);

  const tableColumns = useMemo(() => () => {

    let tableColumns = [];

    const sortColumn = {key: 'sort', align: 'center', width: 80, render: () => <HolderOutlined/>}

    const indexColumn = {
      key: 'index',
      title: "No",
      width: 80,
      render: (_: any, __: any, i: number) => i,
    };

    const operationsColumn = {
      key: 'table-operations-column',
      title: 'operations',
      width: 240,
      fixed: 'right' as any,
      ...operations
    };

    if (Array.isArray(columns) && columns.length) {
      tableColumns = columns;
    } else if (Array.isArray(tableData) && tableData.length) {
      tableColumns = createTableColumns(tableData[0]);
    }

    const blackList = ['id'];
    tableColumns = tableColumns.filter((v => !blackList.includes(v.dataIndex) && filterColumns.includes(v.dataIndex)));

    return tableColumns.length ? [sortColumn, indexColumn, ...tableColumns, operationsColumn] : [];

  }, [columns, tableData, filterColumns]);

  const createTableColumns = (obj: { [key: string]: any }) => {
    if (!Object.keys(obj).length) return [];
    return Object.entries(obj)
      .map(([key, val]) => {
        const config = {
          key: key,
          dataIndex: key,
          title: key,
          width: 200,
          valueType: typeof val !== 'object' ? 'text' : 'input'
        };
        return {
          ...config,
          render: (text: any, record: any, index: number) => renderColumn(config, text, record, index),
        }
      });
  };

  const renderColumn = (config: any, text: any, record: any, index: number) => {
    if (['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(text))) {
      return renderJsonView(text, config);
    } else {
      return renderTextColumn(text, config);
    }
    return String(text);
  }

  const renderJsonView = (text: any, config: any) =>
    <TextOverflowTip
      width={config.width}
      popRender={() => <JsonViewer name={config.dataIndex} src={text}/>}
      popAble
    >{JSON.stringify(text)}</TextOverflowTip>;

  const renderTextColumn = (text: any, config: any) =>
    <TextOverflowTip width={config.width}>{String(text)}</TextOverflowTip>;

  return {
    filterColumns,
    setFilterColumns,
    tableColumns: tableColumns(),
  };
};

export default useTableColumns;
