import React, { useEffect } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import Styles from './index.module.scss';
import TextOverflowTip from '@/components/text-overflow-tip';

export interface OverviewProps {
  [key: string]: any;
}

const Overview: React.FC<OverviewProps> = (props: OverviewProps) => {
  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <div className={classNames([Styles.overview])}>
        <div className={Styles.info}>
          <div className={Styles.title}>Pick a prompt word</div>
          <div className={Styles.subTitle}>
            Start now, collision with the soul of the prompt word
          </div>
        </div>
        <div className={Styles.controller}>
          <Button className={'mr-3'} icon={<EyeOutlined />}>
            <Link to={'/home'}>See all</Link>
          </Button>
          <TextOverflowTip width={100} popRender={(p: any) => p.children}></TextOverflowTip>
        </div>
        <div className={Styles.content}></div>
      </div>
    </React.Fragment>
  );
};

export default React.memo(Overview);
