import React, {useEffect} from "react";
import useScroll from "@/hooks/useScroll.ts";
import {Button} from "antd";

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps) => {

  const {} = props

  const {scrollToBottom} = useScroll({querySelector: '#wrapper', isShow: true})


  useEffect(() => {
  }, []);

  const childs = Array(100).fill(null).map((v, i) => (<li>{i}</li>))


  return (
    <React.Fragment>

      test page

      <ul id={'wrapper'} style={{height: 200, overflow: 'auto'}}>
        {childs}
      </ul>

      <Button onClick={() => {
        scrollToBottom()
      }}>to bottom</Button>

    </React.Fragment>
  );
};

export default React.memo(Test);
