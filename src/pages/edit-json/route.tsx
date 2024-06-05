import { type ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import EditJson from './index.tsx';

const EditJsonRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <EditJson />,
    },
  ]);
  return routers;
};

export default EditJsonRoutes;
