import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import WebApp from '@twa-dev/sdk'

try {
  console.log('Initializing WebApp...');
  WebApp.ready();
  console.log('WebApp initialized successfully');
} catch (error) {
  console.error('Error initializing WebApp:', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
