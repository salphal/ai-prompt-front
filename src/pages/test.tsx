import React, {useState, useEffect} from "react";
import classNames from "classnames";
import Countdown from "@/utils/count-down.ts";

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps) => {

  const [count, setCount] = useState(0);

  const {} = props

  useEffect(() => {
    const countDown = new Countdown(10, (count) => {
      setCount(count);
    });
    countDown.start();
  }, []);

  return (
    <React.Fragment>

      <div className={classNames([])}>
        {count}
      </div>

    </React.Fragment>
  );
};

export default React.memo(Test);
