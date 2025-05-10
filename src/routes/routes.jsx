import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
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
    //* route ini hanya digunakan untuk pengembangan
    // {
    //     path: '/testing',
    //     element: <Testing />
    // }
])

export default router;