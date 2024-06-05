import { type ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';

import EditPrompt from './index.tsx';

const EditPromptRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <EditPrompt />,
    },
  ]);
  return routers;
};

export default EditPromptRoutes;
