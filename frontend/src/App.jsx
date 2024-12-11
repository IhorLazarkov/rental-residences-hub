import { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { useDispatch } from "react-redux";
import * as sessionActions from './store/session';
import Navigation from "./components/Navigation/Navigation";
import LandingPage from "./components/LandingPage";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import NewSpot from "./components/NewSpot/NewSpotForm";
import ManageSpostPage from "./components/ManageSpots/ManageSpostPage";


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
        element: <LandingPage />
      },
      {
        path: ':spotId',
        element: <SpotDetails />
      },
      {
        path: "spots/new",
        element: <NewSpot />
      },
      {
        path:"spots/current",
        element: <ManageSpostPage />
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
