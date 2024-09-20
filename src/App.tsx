import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    WebApp.ready();
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome to ₿earn</h1>
      <button onClick={() => WebApp.showAlert('Hello from ₿earn!')}>
        Click me
      </button>
    </div>
  );
}

export default App;