import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import WebApp from '@twa-dev/sdk'

WebApp.ready();
WebApp.expand(); // This will expand the mini app to full height

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
