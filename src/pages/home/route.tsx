import { type ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import Home from './index.tsx';

const HomeRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <Home />,
    },
  ]);
  return routers;
};

export default HomeRoutes;
