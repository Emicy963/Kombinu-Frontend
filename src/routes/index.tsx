import { createBrowserRouter } from 'react-router-dom';
import BaseLayout from '../components/layout/BaseLayout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import DashboardAprendiz from '../pages/DashboardAprendiz';
import DashboardCriador from '../pages/DashboardCriador';
import Marketplace from '../pages/Marketplace';
import Quiz from '../pages/Quiz';
import Ranking from '../pages/Ranking';
import CriarConteudo from '../pages/CriarConteudo';
import VisualizarConteudo from '../pages/VisualizarConteudo';
import PainelAdmin from '../pages/PainelAdmin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'dashboard',
        children: [
          {
            path: 'learner',
            element: <DashboardAprendiz />,
          },
          {
            path: 'creator',
            element: <DashboardCriador />,
          },
          {
            path: 'admin',
            element: <PainelAdmin />,
          },
        ],
      },
      {
        path: 'courses',
        children: [
          {
            index: true,
            element: <Marketplace />,
          },
          {
            path: 'create',
            element: <CriarConteudo />,
          },
          {
            path: ':id',
            element: <VisualizarConteudo />,
          },
        ],
      },
      {
        path: 'quiz/:id',
        element: <Quiz />,
      },
      {
        path: 'ranking',
        element: <Ranking />,
      },
    ],
  },
]);
