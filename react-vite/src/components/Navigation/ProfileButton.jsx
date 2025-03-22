import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { CiMenuBurger } from "react-icons/ci";

import { thunkLogout } from "../../redux/session";


import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

import './ProfileButton.css'



function ProfileButton() {



  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    closeMenu();
  };



  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");







  return (
    <>
      <button
      className="menu-button"
      onClick={toggleMenu}
      >
        <div className='menu-icon'>
        <CiMenuBurger />
        </div>
        <div className='user-icon' >
        <FaUserCircle />
        </div>
      </button>
      {showMenu && (
        <div className={ulClassName} ref={ulRef}>
          {user ? (
             <div
             className='auth-container'
             >
              <li>{user.username}</li>
              <li>{user.email}</li>
              <li>
                <button onClick={logout}>Log Out</button>
              </li>
            </div>
          )

          :

          (
            <div
            className="auth-container"
            >
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
                className="auth-button"
              />
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
                className="auth-button"
              />
            </div>


          )}
        </div>
      )}
    </>
  );
}

export default ProfileButton;
