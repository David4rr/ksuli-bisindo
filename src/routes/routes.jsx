import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
import Testing2 from '../pages/testing2';
import KosaKatapage from '../pages/kosaKata';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/kosakata',
        element: <KosaKatapage />
    },
    {
        path: '/testing2',
        element: <Testing2 />
    }
])

export default router;