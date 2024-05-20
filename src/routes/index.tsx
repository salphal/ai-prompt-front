import {Navigate, type RouteObject} from 'react-router-dom'
import OverviewRoutes from "@/pages/overview/route.tsx";
import HomeRoutes from "@/pages/home/route.tsx";
import Test from "@/pages/test.tsx";

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
    path: '/test',
    element: <Test/>
  }
]

export default routes
