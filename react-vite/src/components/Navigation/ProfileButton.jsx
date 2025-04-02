import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
// import { CiMenuBurger } from "react-icons/ci";

import { thunkLogout } from "../../redux/session";

import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";

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
    <div
    className="pro-divvy"
    >
      <button
      className="menu-button"
      onClick={toggleMenu}
      >
        {/* <div className='menu-icon'>
        <CiMenuBurger />
        </div> */}

        <FaUserCircle
        className="user-circle"
        />

      </button>
      {showMenu && (
        <div className={ulClassName} ref={ulRef}>
          {user ? (
             <div
             className='auth-container-user'
             >
              <li>{user.username}</li>
              <li>{user.email}</li>
              <button>Add Credit Card</button>
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
              <OpenModalButton
                buttonText="Log In"
                // onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
                className="login"
              />

              <OpenModalButton
                buttonText="Sign Up"
                // onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
                className="signup"
              />


             


            </div>



          )}
        </div>
      )}
    </div>
  );
}

export default ProfileButton;
