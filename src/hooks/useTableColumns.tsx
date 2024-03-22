import {useMemo} from "react";
import TextOverflowTip from "@/components/text-overflow-tip";

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

    return [
      ...columns.map((v: any) => ({...v, render: (v: any) => <TextOverflowTip width={v.width}>{v}</TextOverflowTip>})),
      operationsColumn
    ];

  }, [columns])

  return {
    tableColumns: tableColumns()
  };
};

export default useTableColumns;
