import '@fontsource/ibm-plex-sans-jp';
import { NotFound } from 'components/NotFound';
import { TheatreDetail } from 'components/TheatreDetail';
import { TheatreList } from 'components/TheatreList';
import { TheatreScreen } from 'components/TheatreScreen';
import { TheatreSeat } from 'components/TheatreSeat';
import { AdminLayout } from 'layouts/AdminLayout';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

const router = createBrowserRouter([
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
    path: ':uuid',
    element: (
      <div className="w-screen min-h-screen bg-slate-200">
        <Outlet />
      </div>
    ),
    children: [
      {
        path: '',
        element: <TheatreSeat />,
      },
      {
        path: 'screen',
        element: <TheatreScreen />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router} />);
