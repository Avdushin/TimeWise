import { RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import Routing from './Routing/Router';
import { useEffect } from 'react';
import { useAuth } from '@/Store';
import { dev } from '@/Utils';

function App() {
  const chekAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    chekAuth().then((data) => {
        dev.log(data);
    });
  }, []);
  return <RouterProvider router={Routing()} />;
}

export default App;
