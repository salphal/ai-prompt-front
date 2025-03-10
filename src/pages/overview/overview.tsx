import React, {useEffect} from "react";
import Styles from "./index.module.scss";
import classNames from "classnames";
import {Button} from "antd";
import {EyeOutlined,} from '@ant-design/icons';
import {Link} from "react-router-dom";
import TextOverflowTip from "@/components/text-overflow-tip";

export interface OverviewProps {
  [key: string]: any;
}

const Overview: React.FC<OverviewProps> = (props: OverviewProps) => {

  const {} = props;

  // const [content, setContent] = useState({
  //   json: {
  //     name: "Hello World",
  //   },
  //   text: undefined
  // });
  //
  // const [dataList, setDataList] = useState([
  //   {
  //     render: <PromptMessage data={{role: 'user', content: 'first'}}/>,
  //   },
  //   {
  //     render: <PromptMessage data={{role: 'system', content: 'second'}}/>,
  //   },
  //   {
  //     render: <PromptMessage data={{role: 'assistant', content: 'third'}}/>,
  //   }
  // ]);

  useEffect(() => {
  }, []);


  return (
    <React.Fragment>

      <div className={classNames([Styles.overview])}>
        {/*<DraggableList dataList={dataList} setDataList={setDataList}/>*/}
        {/*<PromptForm/>*/}
        {/*<JsonEditor*/}
        {/*  mode={'text'}*/}
        {/*  mainMenuBar={false}*/}
        {/*  statusBar={false}*/}
        {/*  content={content}*/}
        {/*  onChange={setContent}*/}
        {/*/>*/}
        {/*<PromptMessage/>*/}

        <div className={Styles.info}>
          <div className={Styles.title}>Pick a prompt word</div>
          <div className={Styles.subTitle}>Start now, collision with the soul of the prompt word</div>
        </div>
        <div className={Styles.controller}>
          <Button className={'mr-3'} icon={<EyeOutlined/>}><Link to={'/home'}>See all</Link></Button>
          <TextOverflowTip width={100} popRender={(p: any) => p.children}></TextOverflowTip>
        </div>
        <div className={Styles.content}>
        </div>

      </div>

    </React.Fragment>
  );
};

export default React.memo(Overview);
