import React, {ForwardRefRenderFunction, Ref, useImperativeHandle, useMemo, useState} from "react";
import classNames from "classnames";
import {EditableProTable} from "@ant-design/pro-components";
import {v4 as uuidv4} from 'uuid';

export interface IColumnItem {
  title: string;
  dataIndex: string;
  width: string | number;
  valueType?: 'text' | 'select' | 'option' | string;
  formItemProps: {
    [key: string]: any;
    rules: Array<any>
  };
  valueEnum: {
    [key: string]: {
      text: string;
      status: any;
    };
  };

  [key: string]: any;
}

export interface EditableTableProps {
  dataSource: Array<any>;
  onChange: (value: any) => void;
  columns: Array<any>;
  /** 行数据唯一标识 */
  rowKey: string;
  /** 列表标题 */
  headerTitle?: string;
  /** 顶部工具行渲染函数 */
  toolBarRender?: () => Array<any>;
  /** 操作列渲染函数 */
  optionColumnRender?: (row: any, config: any, defaultDoms: any) => Array<any>
  /** 是否显示添加 */
  addable?: boolean;
  /** 单行默认数据 */
  defaultRowData?: any;
  /** 列表滚动设置 */
  scroll?: { x?: number, y?: number }

  [key: string]: any;
}

interface EditableTableRef {
  [key: string]: any;
}

/**
 * https://procomponents.ant.design/components/editable-table#%E5%AE%9E%E6%97%B6%E4%BF%9D%E5%AD%98%E7%9A%84%E7%BC%96%E8%BE%91%E8%A1%A8%E6%A0%BC
 */
const EditableTable: ForwardRefRenderFunction<EditableTableRef, EditableTableProps> = (
  props: EditableTableProps,
  ref: Ref<EditableTableRef | HTMLDivElement>
) => {

  const {
    rowKey = 'id',
    columns,
    dataSource,
    onChange,
    toolBarRender,
    optionColumnRender,
    headerTitle = '',
    addable = false,
    scroll,
    defaultRowData = {},
    ...restProps
  } = props;

  const [optionColumn] = columns.filter((v) => v.valueType === 'option');

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    dataSource.map((item: any) => item.id),
  );

  const getOriginalValueDataIndex = (columns: Array<any>, dataSource: Array<any>) => {
    const columnDataMap: any = {};
    const allColumnDataIndex = columns.map(v => v.dataIndex);

    allColumnDataIndex.forEach(k => {
      columnDataMap[k] = [];
    })

    dataSource.forEach(v => {
      allColumnDataIndex.forEach(k => {
        const value = v[k] || null;
        columnDataMap[k].push(value);
      });
    });

    return allColumnDataIndex.filter(k => columnDataMap[k].some((v: any) => typeof v !== 'object'));
  };

  const editableColumns = useMemo(() => () => {
    if (!Array.isArray(columns) || !columns.length || !Array.isArray(dataSource) || !dataSource.length) return [];
    const originalValueDataIndex = getOriginalValueDataIndex(columns, dataSource);
    return columns.filter(v => originalValueDataIndex.includes(v.dataIndex));
  }, [columns, dataSource]);

  const aa = editableColumns();


  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  return (
    <React.Fragment>

      <EditableProTable<any>
        className={classNames([])}
        headerTitle={headerTitle}
        columns={editableColumns()}
        rowKey={rowKey}
        scroll={scroll ? scroll : {x: 'max-content', y: 300}}
        value={dataSource}
        onChange={onChange}
        recordCreatorProps={
          addable ? {
            newRecordType: 'dataSource',
            record: () => ({
              id: uuidv4(),
              ...defaultRowData
            }),
          } : false
        }
        toolBarRender={() => {
          return typeof toolBarRender === 'function' ? toolBarRender() : [];
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return typeof optionColumnRender === 'function' ?
              optionColumnRender(row, config, defaultDoms) :
              [
                defaultDoms.delete,
                // defaultDoms.save,
                // defaultDoms.cancel
              ];
          },
          onValuesChange: (record, recordList) => {
            typeof onChange === 'function' && onChange(recordList);
          },
          onChange: setEditableRowKeys,
        }}
        {...restProps}
      />

    </React.Fragment>
  );
};

export default React.forwardRef(EditableTable);
