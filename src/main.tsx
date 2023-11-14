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
      <p>
        <Outlet />
      </p>
    ),
    children: [
      {
        path: '',
        element: <p>movie list</p>,
      },
      {
        path: ':uuid',
        element: <p>detail</p>,
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