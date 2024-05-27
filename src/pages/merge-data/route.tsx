import {type ReactElement} from 'react';
import {useRoutes} from 'react-router-dom';

import MergeData from './index.tsx';

const MergeDataRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <MergeData/>,
    },
  ]);
  return routers;
};

export default MergeDataRoutes;
