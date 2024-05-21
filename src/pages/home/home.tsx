import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle, useState} from "react";
import classNames from "classnames";
import {Button, Form, Input, Pagination, Select, Table, Upload} from "antd";
import {useForm} from "antd/es/form/Form";
import useClientRect from "@/hooks/useClientRect.ts";
import {DownloadOutlined, RedoOutlined, UploadOutlined} from "@ant-design/icons";
import useUpload from "@/hooks/useUpload.ts";
import useTableColumns from "@/hooks/useTableColumns.tsx";
import usePromptStore, {setPromptData} from "@/store/prompt.ts";
import {useShallow} from "zustand/react/shallow";
import {v4 as uuidv4} from 'uuid';
import {FILTER_KEYS, FILTER_LABELS} from "@/pages/home/constants/filter.tsx";
import {useNavigate} from "react-router-dom";

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

  const navigate = useNavigate();

  const [form] = useForm();

  const {} = props;

  const {
    promptData,
  } = usePromptStore(useShallow((state: any) => state));

  const {height: tableHeight} = useClientRect({id: 'table-wrapper'});
  const tableScroll = {
    y: tableHeight ? tableHeight - 56 : 1000,
    x: 'max-content',
  };
  const {uploadProps, fileContent, onExportFile} = useUpload({
    onBefore: () => false
  });

  // const [tableData, setTableData] = useState([]);
  const [paginationConfig, setPaginationConfig] = useState<any>({
    current: 1,
    pageSize: 100,
    total: 0
  });

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (!Array.isArray(fileContent.content) || !fileContent.content.length) return;
    const data = fileContent.content.map((v: any) => ({...v, ...v.modelConfig, id: uuidv4()}));
    setPromptData(data);
    setPaginationConfig((p: any) => ({...p, total: data.length}));
  }, [fileContent]);

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
  const {tableColumns, filterColumns} = useTableColumns({tableData: promptData, operations: tableOperationsColumn})

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

  return (
    <React.Fragment>

      <div className={'flex flex-col justify-between h-full'}>
        <div className={'flex flex-row justify-between items-center py-2'}>
          <Form form={form} layout={'inline'}>
            <Form.Item name={FILTER_KEYS.key} label={FILTER_LABELS[FILTER_KEYS.key]}>
              <Select style={{width: 120}} options={filterColumns.map(k => ({label: k, value: k}))}/>
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
              <Button
                className={'mr-3'} icon={< DownloadOutlined/>}>Import</Button>
            </Upload>
            <Button
              className={'mr-3'}
              icon={<UploadOutlined/>}
              onClick={() => handlePromptEventAspect('export')}
            >Export</Button>
            <Button
              icon={<RedoOutlined/>}
              onClick={() => handlePromptEventAspect('reset')}
            >Reset</Button>
          </div>
        </div>
        <div id={'table-wrapper'} className={'flex-1'}>
          <Table
            rowKey={(record: any) => record.key || record.id}
            dataSource={promptData}
            columns={tableColumns}
            pagination={false}
            scroll={tableScroll}
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
