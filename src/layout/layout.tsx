import React, {useEffect} from "react";
import {
  ProLayout,
} from '@ant-design/pro-components';
import Styles from "./index.module.scss";
import classNames from "classnames";
import {useLocation} from "react-router-dom";

export interface LayoutProps {
  [key: string]: any;
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {

  const {pathname} = useLocation();

  const {} = props;

  useEffect(() => {
  }, []);

  return (
    <React.Fragment>

      <ProLayout
        className={classNames([Styles.layout])}
        splitMenus
        title={"AI Prompt"}
        logo={null}
        location={{
          pathname,
        }}
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
        onMenuHeaderClick={(e) => console.log(e)}
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
