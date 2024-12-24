// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosMenu } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(() => {
      setShowMenu(false);
    });
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user ? (
        <>
          <div id='nav-button-container'>
            {user && <NavLink to="/spots/new">Create a New Spot</NavLink>}
            <button
              className="profile"
              onClick={toggleMenu}
            >
              <IoIosMenu style={{ fontSize: "20px" }} />
              <FaUserCircle style={{ fontSize: "33px" }} />
            </button>
          </div>
          <div id='nav-button-container-mobile'>
            <button
              className="profile"
              onClick={toggleMenu}
            >
              <IoIosMenu />
            </button>
          </div>
          <ul className={ulClassName} ref={ulRef}>
            <li>Hello, {user.username}</li>
            <li>email: {user.email}</li>
            <li><hr /></li>
            <li><NavLink to={`/spots/current`}>Manage Spots</NavLink></li>
            <li><NavLink to={`/reviews/current`}>Manage Reviews</NavLink></li>
            <li><hr /></li>
            <li>
              <button className="secondary" onClick={logout}>Log Out</button>
            </li>
          </ul>
        </>
      ) : (
        <ul className='login-signup'>
          <li>
            <OpenModalButton
              buttonText="Log In"
              className="secondary"
              onButtonClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              className="primary"
              onButtonClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </li>
        </ul>
      )}
    </>
  );
}

export default ProfileButton;