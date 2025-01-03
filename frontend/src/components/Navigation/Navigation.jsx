// frontend/src/components/Navigation/Navigation.jsx

import { Navigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useEffect, useState } from 'react';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const newSpot = useSelector(state => state.spots.newSpot)
  const [spotId, setSpotId] = useState(null)

  useEffect(() => {
    if (newSpot) setSpotId(newSpot.id)
  }, [newSpot])

  return (
    <nav>
      <NavLink id="logo" to="/">
        <span>rental</span>
        <span>residence</span>
        <span>hub</span>
      </NavLink>
      {isLoaded && (
        <div style={{ position: "relative", minWidth: "150px" }}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      {!sessionUser && <Navigate to="/" replace={true} />}
      {sessionUser && <Navigate to="/" replace={true} />}
      {newSpot && <Navigate to={`/${spotId}`} replace={true} />}
    </nav>
  );
}

export default Navigation;