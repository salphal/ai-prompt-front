import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom';
import "normalize.css"
import {ConfigProvider} from "antd";
import {StyleProvider} from '@ant-design/cssinjs';
import App from './App.tsx'
import './main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider>
      <StyleProvider hashPriority="high">
        <App/>
      </StyleProvider>
    </ConfigProvider>
  </BrowserRouter>
  // </React.StrictMode>,
)
