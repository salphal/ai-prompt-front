import React, {ForwardRefRenderFunction, Ref, useEffect, useImperativeHandle, useState} from "react";
import classNames from "classnames";
import {Button, Form, Input, Pagination, Table, Upload} from "antd";
import {TABLE_COLUMNS} from "@/pages/home/constant.tsx";
import {useForm} from "antd/es/form/Form";
import {PROMPT_ITEM_KEYS, PROMPT_ITEM_LABELS} from "@/constants/prompt.ts";
import useClientRect from "@/hooks/useClientRect.ts";
import {DownloadOutlined, UploadOutlined, RedoOutlined} from "@ant-design/icons";
import useUpload from "@/hooks/useUpload.ts";
import useTableColumns from "@/hooks/useTableColumns.ts";

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

  const {} = props;

  const {height: tableHeight} = useClientRect({id: 'table-wrapper'});
  const tableScroll = {
    y: tableHeight ? tableHeight - 56 : 1000,
    x: 'max-content',
  };
  const {uploadProps, fileContent, onExportFile} = useUpload({
    onBefore: () => false
  });

  const [tableData, setTableData] = useState([]);
  const [paginationConfig, setPaginationConfig] = useState<any>({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Customize instance values exposed to parent components
  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    if (!Array.isArray(fileContent.content)) return;
    const data = fileContent.content.map((v: any) => ({...v, ...v.modelConfig}));
    setTableData(data);
  }, [fileContent]);


  const tableOperationsColumn = {
    render: () => {
      return (
        <div>
          <Button className={classNames({})} size={'small'}>编辑</Button>
        </div>
      );
    }
  }
  const {tableColumns} = useTableColumns({columns: TABLE_COLUMNS, operations: tableOperationsColumn})

  const paginationOnChange = (current: number, pageSize: number) => {
    setPaginationConfig((prev: any) => ({...prev, current, pageSize}));
  };

  const buttonOnExport = () => {
    onExportFile(fileContent);
  };

  return (
    <React.Fragment>

      <div className={'flex flex-col justify-between h-full'}>
        <div className={'flex flex-row justify-between items-center py-2'}>
          <Form form={form} layout={'inline'}>
            <Form.Item name={PROMPT_ITEM_KEYS.name} label={PROMPT_ITEM_LABELS[PROMPT_ITEM_KEYS.name]}>
              <Input/>
            </Form.Item>
            <Form.Item>
              <Button type={'primary'} ghost>搜索</Button>
            </Form.Item>
          </Form>
          <div className={'flex flex-row'}>
            <Upload {...uploadProps}>
              <Button className={'mr-3'} icon={< DownloadOutlined/>}>导入</Button>
            </Upload>
            <Button className={'mr-3'} icon={<UploadOutlined/>} onClick={buttonOnExport}>导出</Button>
            <Button icon={<RedoOutlined/>} onClick={buttonOnExport}>重置</Button>
          </div>
        </div>
        <div id={'table-wrapper'} className={'flex-1'}>
          <Table
            dataSource={tableData}
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
