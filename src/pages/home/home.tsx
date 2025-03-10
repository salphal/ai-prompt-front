import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import classNames from "classnames";
import {Button, Checkbox, Form, Input, message, Pagination, Popover, Select} from "antd";
import {useForm} from "antd/es/form/Form";
import useClientRect from "@/hooks/useClientRect.ts";
import {
  CopyOutlined,
  DeleteOutlined,
  DiffOutlined,
  FilterFilled,
  FilterOutlined,
  FormOutlined,
  MergeCellsOutlined,
  PlusOutlined
} from "@ant-design/icons";
import useTableColumns from "@/hooks/useTableColumns.tsx";
import usePromptStore, {
  setColumnFilterKeys,
  setColumnKeys,
  setDataSource,
  setDefaultRowData,
  setFormData,
  setSelectedRowKeys
} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {FILTER_KEYS, FILTER_LABELS} from "@/pages/home/constants/filter.tsx";
import {useNavigate} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import EditableTable from "@/components/editalbe-table";
import {resetObject} from "@/utils/format.ts";
import Countdown from "@/utils/count-down.ts";
import "./index.scss";
import SortableTable from "@/components/sortable-table";
import EditTableColumns from "@/pages/home/components/edit-table-columns";
import {HomeContextProvider} from "@/pages/home/context.ts";

export interface HomeProps {
  [key: string]: any;
}

interface HomeRef {
  [key: string]: any;
}

const Home: ForwardRefRenderFunction<HomeRef, HomeProps> = (
  props: HomeProps,
  ref: Ref<HomeRef | HTMLDivElement>
) => {

  const [form] = useForm();
  const navigate = useNavigate();

  const {
    dataSource,
    columnKeysOptions,
    columnFilterKeys,
    columnKeys,
    selectedRowKeys,
    defaultRowData,
    formData,
  } = usePromptStore(useShallow((state: any) => state));

  const {height: tableHeight} = useClientRect({id: 'table-wrapper'});
  const tableScroll = {
    y: tableHeight ? tableHeight - 56 : 1000,
    x: 'max-content',
  };

  const tableOperationsColumn = {
    render: (v: any, record: any) => {
      return (
        <div>
          <Button
            className={classNames(['mr-3'])}
            size={'small'}
            onClick={() => handlePromptEventAspect('edit', record)}
          >Edit</Button>
          <Button
            className={classNames(['mr-3'])}
            size={'small'}
            onClick={() => handlePromptEventAspect('prompt', record)}
          >Prompt</Button>
          <Button
            size={'small'}
            onClick={() => handlePromptEventAspect('delete', record)}
          >Delete</Button>
        </div>
      );
    }
  }
  const {
    tableColumns,
    tableColumnKeys,
    setTableColumnBlackKeys,
    rowData
  } = useTableColumns({
    tableData: dataSource,
    operations: tableOperationsColumn,
    dragAble: true,
    indexAble: true,
    operationAble: true
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [paginationConfig, setPaginationConfig] = useState<any>({
    current: 1,
    pageSize: 100,
    total: 0
  });

  const editTableColumnModalRef = useRef<any>(null);

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    setColumnKeys(tableColumnKeys)
  }, [tableColumnKeys]);

  useLayoutEffect(() => {
    setLoading(true);
    const countDown = new Countdown(
      2,
      (duration) => {
        duration <= 0 && setLoading(false);
      },
    );
    countDown.start();
  }, []);

  useEffect(() => {
    if (!Array.isArray(dataSource) || !dataSource.length) return;
    setDefaultRowData(resetObject(dataSource[0]));
  }, [dataSource]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData]);

  useEffect(() => {
    setTableColumnBlackKeys((prev: any[]) => [...columnFilterKeys]);
  }, [columnFilterKeys])

  const dataSourceByFilter = useMemo(() => () => {
    const queryKey = formData[FILTER_KEYS.key];
    const queryString = formData[FILTER_KEYS.query];
    if (!queryKey || !queryString) return dataSource;
    return dataSource.filter((rowData: any) =>
      typeof rowData[queryKey] === 'string' && rowData[queryKey].toLowerCase().indexOf(queryString) !== -1);
  }, [formData, dataSource]);

  const rowSelectionOnChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const tableRowSelection: any = {
    selectedRowKeys,
    onChange: rowSelectionOnChange,
    fixed: 'left',
  };

  const paginationOnChange = (current: number, pageSize: number) => {
    setPaginationConfig((prev: any) => ({...prev, current, pageSize}));
  };

  const handlePromptEventAspect = (type: string, kwargs: object = {}, ...args: any[]) => {
    if (['copy', 'remove'].includes(type)) {
      if (!selectedRowKeys.length) {
        message.warning('Please select one or more rows.');
        return;
      }
    }

    const handles: any = {
      search: handlePromptOnSearch,
      edit: handlePromptOnEdit,
      editable: handlePromptOnEditable,
      editColumns: handlePromptOnEditColumns,
      prompt: handlePromptOnPrompt,
      add: handlePromptOnAdd,
      delete: handlePromptOnDelete,
      copy: handlePromptOnCopy,
      remove: handlePromptOnRemove,
      merge: handlePromptOnMerge,
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);

    if (['add', 'delete', 'remove', 'copy',].includes(type)) {
      setSelectedRowKeys([]);
    }
  };

  const handlePromptOnSearch = () => {
  };

  const handlePromptOnEdit = (record: any) => {
    navigate(`/edit-json?id=${record.id}`, {state: record});
  };

  const handlePromptOnEditable = (record: any) => {
    setIsEditable(prev => !prev);
  };

  const handlePromptOnEditColumns = (record: any) => {
    editTableColumnModalRef.current.showModal();
  };

  const handlePromptOnPrompt = (record: any) => {
    navigate(`/edit-prompt?id=${record.id}`, {state: record});
  };

  const handlePromptOnAdd = () => {
    setDataSource((prev: any) => [...prev, {...defaultRowData, id: uuidv4()}]);
  };

  const handlePromptOnDelete = (record: any) => {
    if (!record.id) return;
    setDataSource((prev: any) => prev.filter((v: any) => v.id !== record.id));
  };

  const handlePromptOnCopy = () => {
    if (!selectedRowKeys.length) return;
    const selectedItems = dataSource
      .filter((v: any) => selectedRowKeys.includes(v.id))
      .map((v: any) => ({
        ...v,
        id: uuidv4(),
      }));
    setDataSource((prev: any) => [...prev, ...selectedItems]);
  };

  const handlePromptOnRemove = () => {
    setDataSource((prev: any) => prev.filter((v: any) => !selectedRowKeys.includes(v.id)))
  };

  const handlePromptOnMerge = () => {
    navigate(`/merge-data`);
  };

  const formOnValueChange = (changedValues: any, allValues: any) => {
    setFormData({...allValues});
  };

  const tableFilterOnChange = (value: Array<any>) => {
    setColumnFilterKeys(value);
  };

  const selectedAllOnChange = () => {
    setColumnFilterKeys((prev: any[]) => prev.length === columnKeys.length ? [] : columnKeys);
  }

  return (
    <React.Fragment>

      <HomeContextProvider value={{
        rowData
      }}>

        <div className={'flex flex-col justify-between h-full'}>
          <div className={classNames(['flex', 'flex-row', 'justify-between', 'items-center'])}>
            <Form form={form} layout={'inline'} onValuesChange={formOnValueChange}>
              <Form.Item name={FILTER_KEYS.key} label={FILTER_LABELS[FILTER_KEYS.key]}>
                <Select style={{width: 180}} options={columnKeysOptions()}/>
              </Form.Item>
              <Form.Item name={FILTER_KEYS.query} label={FILTER_LABELS[FILTER_KEYS.query]}>
                <Input style={{width: 200}} allowClear/>
              </Form.Item>
            </Form>
            <div className={classNames(['flex', 'justify-end', 'items-center', 'h-16'])}>
              {!isEditable && <>
                <Button
                  className={'mr-3'}
                  icon={<PlusOutlined/>}
                  onClick={() => handlePromptEventAspect('add')}
                >Add</Button>
                <Button
                  className={'mr-3'}
                  icon={<CopyOutlined/>}
                  onClick={() => handlePromptEventAspect('copy')}
                >Copy</Button>
                <Button
                  className={'mr-3'}
                  icon={<DeleteOutlined/>}
                  onClick={() => handlePromptEventAspect('delete')}
                >Delete</Button>
                <Button
                  className={'mr-3'}
                  icon={<MergeCellsOutlined/>}
                  onClick={() => handlePromptEventAspect('merge')}
                >Merge</Button>
              </>}
              <Button
                className={'mr-3'}
                icon={<FormOutlined/>}
                onClick={() => handlePromptEventAspect('editable')}
              >{isEditable ? 'Editable' : 'UnEditable'}</Button>
              <Button
                className={'mr-3'}
                icon={<DiffOutlined/>}
                onClick={() => handlePromptEventAspect('editColumns')}
              >Edit Columns</Button>
              <Popover
                content={<div className={classNames(['pb-6'])}>
                  <div className={classNames(['flex', 'justify-end', 'm-3'])}>
                    <Button size={'small'} onClick={selectedAllOnChange}>Select all</Button>
                  </div>
                  <Checkbox.Group
                    className={classNames(['table-filter', 'flex', 'flex-col'])}
                    options={columnKeysOptions()}
                    value={columnFilterKeys}
                    onChange={tableFilterOnChange}
                  />
                </div>}
                trigger="click"
                placement="bottomLeft"
              >
                <Button
                  icon={columnKeys.length - 1 === columnFilterKeys.length || columnFilterKeys.length === 0
                    ? <FilterOutlined/>
                    : <FilterFilled style={{color: '#000'}}/>}
                  onClick={() => handlePromptEventAspect('filter')}
                />
              </Popover>
            </div>
          </div>
          <div id={'table-wrapper'} className={'flex-1'}>
            {!isEditable ?
              <SortableTable
                loading={loading}
                rowKey={(record: any) => record.key || record.id}
                dataSource={dataSourceByFilter()}
                columns={tableColumns}
                pagination={false}
                scroll={tableScroll}
                rowSelection={(!loading && Array.isArray(dataSource) && dataSource.length && columnFilterKeys.length)
                  ? tableRowSelection : null}
              /> :
              <EditableTable
                loading={loading}
                dataSource={dataSource}
                onChange={setDataSource}
                columns={tableColumns}
                scroll={tableScroll}
              />}
          </div>
          <div className={'py-2'}>
            <Pagination
              className={'float-right'}
              current={paginationConfig.current}
              pageSize={paginationConfig.pageSize}
              total={paginationConfig.total}
              onChange={paginationOnChange}
              showSizeChanger
              showQuickJumper
            />
          </div>
        </div>

        <EditTableColumns ref={editTableColumnModalRef}/>

      </HomeContextProvider>

    </React.Fragment>
  );
};

export default React.forwardRef(Home);
