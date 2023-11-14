import { TheatreDetail } from 'components/TheatreDetail';
import { TheatreList } from 'components/TheatreList';
import { AdminLayout } from 'layouts/AdminLayout';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const router = createBrowserRouter([
  {
    path: 'theatre/:uuid',
    element: <Outlet />,
    children: [
      {
        path: 'lobby',
        element: <p>lobby</p>,
      },
      {
        path: 'screen',
        element: <p>screen</p>,
      },
      {
        path: 'seat',
        element: <p>seat</p>,
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    ),
    children: [
      {
        path: '',
        element: <TheatreList />,
      },
      {
        path: ':uuid',
        element: <TheatreDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <p>404</p>,
  },
]);

const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router} />);
