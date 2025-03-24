import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
import KamusPage from '../pages/Kamus';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/kamus',
        element: <KamusPage />
    }
])

export default router;