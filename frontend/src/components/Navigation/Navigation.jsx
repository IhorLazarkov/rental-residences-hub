// frontend/src/components/Navigation/Navigation.jsx

import { Navigate, NavLink, redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav>
      <NavLink id="logo" to="/">rental residence hub</NavLink>
      {isLoaded && (
        <div style={{ position: "relative", minWidth:"150px" }}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      {!sessionUser && <Navigate to="/" replace={true} />}
    </nav>
  );
}

export default Navigation;