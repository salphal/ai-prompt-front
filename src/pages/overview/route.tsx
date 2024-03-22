import { type ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import Overview from './overview';

const OverviewRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <Overview />,
    },
  ]);
  return routers;
};

export default OverviewRoutes;
