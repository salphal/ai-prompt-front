import {Navigate, type RouteObject} from 'react-router-dom'
import OverviewRoutes from "@/pages/overview/route.tsx";
import Test from "@/pages/test.tsx";
import HomeRoutes from "@/pages/home/route.tsx";
import EditPromptRoutes from "@/pages/edit-prompt/route.tsx";
import EditJsonRoutes from "@/pages/edit-json/route.tsx";
import MergeDataRoutes from "@/pages/merge-data/route.tsx";

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/overview"/>
  },
  {
    path: '/overview',
    element: <OverviewRoutes/>
  },
  {
    path: '/home',
    element: <HomeRoutes/>
  },
  {
    path: '/edit-prompt',
    element: <EditPromptRoutes/>
  },
  {
    path: '/edit-json',
    element: <EditJsonRoutes/>
  },
  {
    path: '/merge-data',
    element: <MergeDataRoutes/>
  },
  {
    path: '/test',
    element: <Test/>
  }
]

export default routes
