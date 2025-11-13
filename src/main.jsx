import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'

const customTheme = {
  token: {
    colorPrimary: '#5b7bff',
    fontFamily: '"Inter", "Segoe UI", Roboto, sans-serif',
    colorBgLayout: '#f5f7fb'
  },
  algorithm: theme.defaultAlgorithm
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </StrictMode>
)
