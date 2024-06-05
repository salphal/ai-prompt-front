import React from 'react';
import { DownloadOutlined, RedoOutlined, UploadOutlined } from '@ant-design/icons';
import { ProLayout } from '@ant-design/pro-components';
import { Button, Upload } from 'antd';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useShallow } from 'zustand/react/shallow';

import Styles from './index.module.scss';
import { tableColumnBlackList } from '@/constants/table.ts';
import useUpload, { IFile } from '@/hooks/useUpload.ts';
import usePromptStore, {
  resetPromptStore,
  setColumnFilterKeys,
  setDataSource,
} from '@/store/prompt.ts';

export interface LayoutProps {
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const { dataSource, columnFilterKeys } = usePromptStore(useShallow((state: any) => state));

  const {} = props;

  const fileOnParse = (file: IFile) => {
    if (file && Array.isArray(file.content)) {
      const data = file.content.map((v: any) => ({ ...v, id: uuidv4() }));
      setDataSource(data);
      updateColumnFilterKeys(data);
    }
  };

  const { uploadProps, onExportFile } = useUpload({
    maxCount: 100,
    onBefore: () => false,
    onParseJson: fileOnParse,
  });

  const updateColumnFilterKeys = (tableData: Array<any>) => {
    if (Array.isArray(tableData) && tableData.length) {
      let rowData: any = {};
      tableData.forEach((v) => {
        rowData = { ...rowData, ...v };
      });
      const allColumnKeys = Object.keys(rowData);
      setColumnFilterKeys((prev: any[]) =>
        [...new Set([...prev, ...allColumnKeys])].filter(
          (v: any) => !tableColumnBlackList.includes(v),
        ),
      );
    }
  };

  const handlePromptEventAspect = (type: string, kwargs: any = {}, ...args: any[]) => {
    const handles: any = {
      importJson: handlePromptOnImportJson,
      exportFile: handlePromptOnExportFile,
      reset: handlePromptOnReset,
    };

    args = Object.keys(kwargs).length || typeof kwargs !== 'object' ? [kwargs, ...args] : args;
    handles[type] && handles?.[type](...args);
  };

  const handlePromptOnImportJson = () => {};

  const handlePromptOnExportFile = () => {
    onExportFile({ content: JSON.stringify(dataSource) });
  };

  const handlePromptOnReset = () => {
    resetPromptStore();
  };

  return (
    <React.Fragment>
      <ProLayout
        className={classNames([Styles.layout])}
        splitMenus
        title={'OpenAI Prompt Management Platform'}
        logo={null}
        location={{
          pathname,
        }}
        // headerRender={() => <div>headerRender</div>}
        // headerTitleRender={() => <div>headerTitleRender</div>}
        headerContentRender={() => (
          <div className={classNames(['flex', 'justify-end', 'w-full'])}>
            <Upload {...uploadProps}>
              <Button className={'mr-3'} icon={<DownloadOutlined />}>
                Import
              </Button>
            </Upload>
            <Button
              className={'mr-3'}
              icon={<UploadOutlined />}
              onClick={() => handlePromptEventAspect('exportFile')}
            >
              Export
            </Button>
            <Button
              className={classNames(['mr-10'])}
              icon={<RedoOutlined />}
              onClick={() => handlePromptEventAspect('reset')}
            >
              Reset
            </Button>
          </div>
        )}
        actionsRender={() => []}
        // avatarProps={{
        //   src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        //   size: 'small',
        //   title: 'admin',
        // }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <p
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              Power by Ant Design
            </p>
          );
        }}
        onMenuHeaderClick={(e) => {
          navigate('/home');
        }}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              console.log('=>(layout.tsx:80) onClick', item, dom);
            }}
          >
            {dom}
          </a>
        )}
        layout="top"
      >
        {props.children}
      </ProLayout>
    </React.Fragment>
  );
};

export default React.memo(Layout);
