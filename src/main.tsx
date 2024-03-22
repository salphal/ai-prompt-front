import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx'
import "normalize.css"
import './main.scss'
import {ConfigProvider} from "antd";

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider>
      <App/>
    </ConfigProvider>
  </BrowserRouter>
  // </React.StrictMode>,
)
