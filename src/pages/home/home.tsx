import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle, useState} from "react";
import classNames from "classnames";
import {Button, Form, Input, Pagination, Select, Upload} from "antd";
import {useForm} from "antd/es/form/Form";
import useClientRect from "@/hooks/useClientRect.ts";
import {DownloadOutlined, FilterOutlined, MergeCellsOutlined, RedoOutlined, UploadOutlined} from "@ant-design/icons";
import useUpload from "@/hooks/useUpload.ts";
import useTableColumns from "@/hooks/useTableColumns.tsx";
import usePromptStore, {setPromptData} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {v4 as uuidv4} from 'uuid';
import {FILTER_KEYS, FILTER_LABELS} from "@/pages/home/constants/filter.tsx";
import {useNavigate} from "react-router-dom";
import useHomeStore, {setHomeFormData} from "@/pages/home/store.ts";
import EditableTable from "@/components/edit-table";

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
    columnKeysOptions
  } = usePromptStore(useShallow((state: any) => state));

  const {
    homeFormData
  } = useHomeStore(useShallow((state: any) => state));

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
        </div>
      );
    }
  }
  const {tableColumns} = useTableColumns({tableData: promptData, operations: tableOperationsColumn})

  const {uploadProps, fileContent, onExportFile} = useUpload({
    onBefore: () => false
  });

  const [paginationConfig, setPaginationConfig] = useState<any>({
    current: 1,
    pageSize: 100,
    total: 0
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    form.setFieldsValue(homeFormData);
  }, [homeFormData])

  useEffect(() => {
    if (!Array.isArray(fileContent.content) || !fileContent.content.length) return;
    const data = fileContent.content.map((v: any) => ({...v, ...v.modelConfig, id: uuidv4()}));
    setPromptData(data);
    setPaginationConfig((p: any) => ({...p, total: data.length}));
  }, [fileContent]);

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
    const handles: any = {
      search: handlePromptOnSearch,
      export: handlePromptOnExport,
      reset: handlePromptOnReset,
      edit: handlePromptOnEdit,
      prompt: handlePromptOnPrompt
    };
    args = Object.keys(kwargs).length ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handlePromptOnSearch = () => {
  };

  const handlePromptOnExport = () => {
    onExportFile(fileContent);
  };

  const handlePromptOnReset = () => {
    setPromptData([]);
  };

  const handlePromptOnEdit = (record: any) => {
    navigate(`/edit-json?id=${record.id}`, {state: record});
  };

  const handlePromptOnPrompt = (record: any) => {
    navigate(`/edit-prompt?id=${record.id}`, {state: record});
  };

  const formOnValueChange = (changedValues: any, allValues: any) => {
    setHomeFormData(allValues);
  };

  return (
    <React.Fragment>

      <div className={'flex flex-col justify-between h-full'}>
        <div className={'flex flex-row justify-between items-center py-2'}>
          <Form form={form} layout={'inline'} onValuesChange={formOnValueChange}>
            <Form.Item name={FILTER_KEYS.key} label={FILTER_LABELS[FILTER_KEYS.key]}>
              <Select style={{width: 120}} options={columnKeysOptions()}/>
            </Form.Item>
            <Form.Item name={FILTER_KEYS.value} label={FILTER_LABELS[FILTER_KEYS.value]}>
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type={'primary'} ghost>搜索</Button>
            </Form.Item>
          </Form>
          <div className={'flex flex-row'}>
            <Upload {...uploadProps}>
              <Button className={'mr-3'} icon={< DownloadOutlined/>}>Import</Button>
            </Upload>
            <Button
              className={'mr-3'}
              icon={<UploadOutlined/>}
              onClick={() => handlePromptEventAspect('export')}
            >Export</Button>
            <Button
              className={'mr-3'}
              icon={<MergeCellsOutlined/>}
              onClick={() => handlePromptEventAspect('merge')}
            >Merge</Button>
            <Button
              className={'mr-3'}
              icon={<RedoOutlined/>}
              onClick={() => handlePromptEventAspect('reset')}
            >Reset</Button>
            <Button
              icon={<FilterOutlined/>}
              onClick={() => handlePromptEventAspect('filter')}
            ></Button>
          </div>
        </div>
        <div id={'table-wrapper'} className={'flex-1'}>
          <EditableTable
            rowKey={(record: any) => record.key || record.id}
            dataSource={promptData}
            columns={tableColumns}
            setDataSource={setPromptData}
            pagination={false}
            scroll={tableScroll}
            rowSelection={promptData.length ? tableRowSelection : null}
          />
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
