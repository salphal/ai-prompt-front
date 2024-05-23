import React, {useEffect} from "react";
import {ProLayout,} from '@ant-design/pro-components';
import Styles from "./index.module.scss";
import classNames from "classnames";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Upload} from "antd";
import {DownloadOutlined, RedoOutlined, UploadOutlined} from "@ant-design/icons";
import useUpload from "@/hooks/useUpload.ts";
import {resetPromptData, setPromptData} from "@/store/prompt.ts";
import {v4 as uuidv4} from "uuid";

export interface LayoutProps {
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {

  const navigate = useNavigate();

  const {pathname} = useLocation();

  const {} = props;

  const {uploadProps, fileContent, onExportFile} = useUpload({
    onBefore: () => false
  });

  useEffect(() => {
    if (!Array.isArray(fileContent.content) || !fileContent.content.length) return;
    const data = fileContent.content.map((v: any) => ({...v, ...v.modelConfig, id: uuidv4()}));
    setPromptData(data);
  }, [fileContent]);

  return (
    <React.Fragment>

      <ProLayout
        className={classNames([Styles.layout])}
        splitMenus
        title={"OpenAI Prompt Management Platform"}
        logo={null}
        location={{
          pathname,
        }}
        // headerRender={() => <div>headerRender</div>}
        // headerTitleRender={() => <div>headerTitleRender</div>}
        headerContentRender={() => <div className={classNames(['flex', 'justify-end', 'w-full'])}>
          <Upload {...uploadProps}>
            <Button className={'mr-3'} icon={< DownloadOutlined/>}>Import</Button>
          </Upload>
          <Button
            className={'mr-3'}
            icon={<UploadOutlined/>}
            onClick={() => onExportFile(fileContent)}
          >Export</Button>
          <Button
            icon={<RedoOutlined/>}
            onClick={() => resetPromptData()}
          >Reset</Button>
        </div>}
        actionsRender={() => []}
        avatarProps={{
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: 'admin',
        }}
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
