import React, {
  ForwardRefRenderFunction,
  Ref,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import classNames from "classnames";
import {Button, Form, Input, message, Pagination, Select, Table} from "antd";
import {useForm} from "antd/es/form/Form";
import useClientRect from "@/hooks/useClientRect.ts";
import {CopyOutlined, DeleteOutlined, FilterOutlined, FormOutlined, PlusOutlined} from "@ant-design/icons";
import useTableColumns from "@/hooks/useTableColumns.tsx";
import usePromptStore, {
  setDefaultRowData,
  setFilterColumnKey,
  setFilterCondition,
  setPromptData,
  setSelectedRowKeys
} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {FILTER_KEYS, FILTER_LABELS} from "@/pages/home/constants/filter.tsx";
import {useNavigate} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import EditableTable from "@/components/editalbe-table";
import {resetObject} from "@/utils/format.ts";
import Countdown from "@/utils/count-down.ts";

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
    promptData,
    columnKeysOptions,
    selectedRowKeys,
    defaultRowData,
    formData
  } = usePromptStore(useShallow((state: any) => state));

  const {height: tableHeight} = useClientRect({id: 'table-wrapper'});
  const tableScroll = {
    y: tableHeight ? tableHeight - 56 : 1000,
    x: 'max-content',
  };

  const tableOperationsColumn = {
    render: (_: any, record: any) => {
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
  const {tableColumns} = useTableColumns({tableData: promptData, operations: tableOperationsColumn})

  const [loading, setLoading] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [paginationConfig, setPaginationConfig] = useState<any>({
    current: 1,
    pageSize: 100,
    total: 0
  });

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

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
    if (!Array.isArray(promptData) || !promptData.length) return;
    setDefaultRowData(resetObject(promptData[0]));
  }, [promptData]);

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData])

  useEffect(() => {
  }, [formData.key, formData.query]);

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

  const promptDataByQuery = useMemo(() => () => {

  }, [promptData, formData]);

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
      prompt: handlePromptOnPrompt,
      add: handlePromptOnAdd,
      delete: handlePromptOnDelete,
      copy: handlePromptOnCopy,
      remove: handlePromptOnRemove,
      merge: handlePromptOnMerge,
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handlePromptOnSearch = () => {
  };

  const handlePromptOnEdit = (record: any) => {
    navigate(`/edit-json?id=${record.id}`, {state: record});
  };

  const handlePromptOnEditable = (record: any) => {
    setIsEditable(prev => !prev);
  };

  const handlePromptOnPrompt = (record: any) => {
    navigate(`/edit-prompt?id=${record.id}`, {state: record});
  };

  const handlePromptOnAdd = () => {
    setPromptData((prev: any) => [...prev, {...defaultRowData, id: uuidv4()}]);
  };

  const handlePromptOnDelete = (record: any) => {
    if (!record.id) return;
    setPromptData((prev: any) => prev.filter((v: any) => v.id !== record.id));
  };

  const handlePromptOnCopy = () => {
    if (!selectedRowKeys.length) return;
    const selectedItems = promptData
      .filter((v: any) => selectedRowKeys.includes(v.id))
      .map((v: any) => ({
        ...v, id: uuidv4(),
      }));
    setPromptData((prev: any) => [...prev, ...selectedItems]);
    setSelectedRowKeys([]);
  };

  const handlePromptOnRemove = () => {
    setPromptData((prev: any) => prev.filter((v: any) => !selectedRowKeys.includes(v.id)))
  };

  const handlePromptOnMerge = () => {
    navigate(`/merge-data`);
  };

  const formOnValueChange = (changedValues: any, allValues: any) => {
    if (changedValues[FILTER_KEYS.key]) {
      setFilterColumnKey(changedValues[FILTER_KEYS.key]);
    }
    if (changedValues[FILTER_KEYS.query]) {
      setFilterCondition(changedValues[FILTER_KEYS.query]);
    }
  };

  return (
    <React.Fragment>

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
                onClick={() => handlePromptEventAspect('remove')}
              >Delete</Button>
              <Button
                className={'mr-3'}
                icon={<DeleteOutlined/>}
                onClick={() => handlePromptEventAspect('merge')}
              >Merge</Button>
            </>}
            <Button
              className={'mr-3'}
              icon={<FormOutlined/>}
              onClick={() => handlePromptEventAspect('editable')}
            >{isEditable ? 'Editable' : 'UnEditable'}</Button>
            <Button
              icon={<FilterOutlined/>}
              onClick={() => handlePromptEventAspect('filter')}
            ></Button>
          </div>
        </div>
        <div id={'table-wrapper'} className={'flex-1'}>
          {!isEditable ?
            <Table
              loading={loading}
              rowKey={(record: any) => record.key || record.id}
              dataSource={promptData}
              columns={tableColumns}
              pagination={false}
              scroll={tableScroll}
              rowSelection={(promptData.length && !loading) ? tableRowSelection : null}
            /> :
            <EditableTable
              loading={loading}
              dataSource={promptData}
              onChange={setPromptData}
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

    </React.Fragment>
  );
};

export default React.forwardRef(Home);
