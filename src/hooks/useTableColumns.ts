import {useMemo} from "react";

export interface IUseTableColumnsProps {
  [key: string]: any;

  columns?: Array<any>;
  operations?: any;
}

const useTableColumns = (props: IUseTableColumnsProps = {}) => {

  const {columns, operations = {}} = props;

  const tableColumns = useMemo(() => () => {
    if (!Array.isArray(columns) || !columns.length) return [];

    const operationsColumn = {
      key: 'table-operations-column',
      title: '操作',
      width: 200,
      fixed: 'right' as any,
      render: (v: any) => v,
      ...operations
    };

    return [...columns, operationsColumn];

  }, [columns])

  return {
    tableColumns: tableColumns()
  };
};

export default useTableColumns;
