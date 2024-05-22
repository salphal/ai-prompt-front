import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import type {GetRef} from 'antd';
import {Form, Input, Select, Table} from 'antd';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

export interface EditableRowProps {
  index: number;
}

export const formItemTypes = {
  input: 'input',
  select: 'select',
}

const EditableRow: React.FC<EditableRowProps> = ({index, ...props}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: string;
  record: any;

  onSave: (record: any) => void;
  rules?: Array<any>;
  formItemType?: string;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = (props) => {

  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    onSave,
    rules = [],
    formItemType = formItemTypes.input,
    ...restProps
  } = props;

  const form = useContext(EditableContext)!;
  const [editing, setEditing] = useState(false);
  const formItemRef = useRef<any>(null);

  useEffect(() => {
    if (editing) formItemRef.current?.focus();
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({[dataIndex]: record[dataIndex]});
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      typeof onSave === 'function' && onSave({...record, ...values});
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing
      ? (
        <Form.Item
          style={{margin: 0}}
          name={dataIndex}
          rules={[...rules]}
        >
          {formItemType === formItemTypes.input && <Input ref={formItemRef} onPressEnter={save} onBlur={save}/>}
          {formItemType === formItemTypes.select && <Select ref={formItemRef} onBlur={save}/>}
        </Form.Item>
      ) : (
        <div className="editable-cell-value-wrap" style={{paddingRight: 24}} onClick={toggleEdit}>
          {children}
        </div>
      );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

interface IEditableTable {
  columns: Array<any>;
  dataSource: Array<any>;
  setDataSource: (value: any) => any;
  /** 单行默认数据 */
  defaultRowData?: any;

  [key: string]: any;
}

const EditableTable: React.FC<React.PropsWithChildren<IEditableTable>> = (props) => {

  const {
    columns = [],
    dataSource = [],
    setDataSource,
    defaultRowData = {},
    ...restTableProps
  } = props;

  const [rowKey, setRowKey] = useState<number>(0);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleEditableTableEventAspect = (type: string, kwargs: any = {}, ...args: any[]) => {
    const handles: any = {
      add: handleEditableTableOnAdd,
      delete: handleEditableTableOnDelete,
      edit: handleEditableTableOnEdit,
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    if (typeof setDataSource !== 'function') {
      console.log(`请检查 setDataSource: ${setDataSource}`);
      return;
    }
    handles[type] && handles?.[type](...args);
  };

  const handleEditableTableOnAdd = () => {
    const newRowData = {
      key: rowKey,
      ...defaultRowData
    };
    setDataSource((prev: any) => [...prev, newRowData]);
    setRowKey(rowKey + 1);
  };

  const handleEditableTableOnDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleEditableTableOnEdit = (row: any) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const editableTableColumns = useMemo(() => () => {
    return columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          onSave: (...args: any[]) => handleEditableTableEventAspect('edit', ...args),
          formItemType: 'input'
        }),
      };

    });
  }, [columns]);

  return (
    <React.Fragment>

      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={editableTableColumns() as ColumnTypes}
        {...restTableProps}
        bordered
      />

    </React.Fragment>
  );
};

export default EditableTable;
