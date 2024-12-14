// frontend/src/components/Navigation/ProfileButton.jsx

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosMenu } from 'react-icons/io';
import { Navigate, NavLink } from 'react-router-dom';
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
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user && <div className='nav-button-container'>
        <NavLink to="/spots/new">Create a New Spot</NavLink>
        <button
          className="profile"
          onClick={toggleMenu}
          style={{ color: "inherit", fontSize: "25px" }}
        >
          <IoIosMenu />
          <FaUserCircle />
        </button>
      </div>
      }
      {user ? (
        <>
          <ul className={ulClassName} ref={ulRef}>
            <li>Hello, {user.firstName}</li>
            <li>{user.email}</li>
            <li><hr /></li>
            <li><NavLink to={`/spots/current`}>Manage Spots</NavLink></li>
            <li><hr /></li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        </>
      ) : (
        <div className="nav-button-container">
          <OpenModalButton
            buttonText="Log In"
            onButtonClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign Up"
            onButtonClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </>
  );
}

export default ProfileButton;