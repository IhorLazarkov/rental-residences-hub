import { useEffect, useState } from "react";
import LoginFormModal from "./components/LoginFormModal/LoginFormModal";
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useDispatch } from "react-redux";
import * as sessionActions from './store/session';
import SignupFormModal from "./components/SignupFormModal/SignupFormModal";
import Navigation from "./components/Navigation/Navigation";


function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      }
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
