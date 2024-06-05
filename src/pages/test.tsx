import React, { useEffect } from 'react';

export interface TestProps {
  [key: string]: any;
}

const Test: React.FC<TestProps> = (props: TestProps) => {
  const {} = props;

  useEffect(() => {}, []);

  return <React.Fragment>test page</React.Fragment>;
};

export default React.memo(Test);
