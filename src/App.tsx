import React from "react";
import Layout from "@/layout";
import routes from "@/routes";
import {useLocation, useRoutes} from "react-router-dom";
import './App.scss';

function App() {

  const {pathname} = useLocation();

  const page = useRoutes(routes);

  if (['/overview'].includes(pathname)) return page;

  return (
    <React.Fragment>

      <Layout>
        {page}
      </Layout>

    </React.Fragment>
  )

}

export default App
