import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import HomePage from '../components/HomePage/HomePage';
import Layout from './Layout';
import Dashboard from '../components/Dashboard/Dashboard';
import StockShow from '../components/StockShow/StockShow'
import BlankPages from '../components/BlankPage/BlankPage';
import LearningCenter from '../components/LearningCenter/LearningCenter'
import TransferFunds from '../components/TransferFunds/TransferFunds';
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element:<HomePage/>,
      },
      {
        path: "/dashboard",
        element: <Dashboard/>
      },

      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/stocks/:stockID",
        element: <StockShow />,
      },
      {
        path: "/coming-soon",
        element:<BlankPages/>
      },
      {
        path:"/learning-center",
        element:<LearningCenter/>
      },
      {
        path:'/transfer',
        element:<TransferFunds/>
      }
    ],
  },
]);
