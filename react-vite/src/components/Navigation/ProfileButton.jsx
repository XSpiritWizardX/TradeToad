import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { thunkLogout } from "../../redux/session";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import PortfolioDeleteModal from "../PortfolioDeleteModal/PortfolioDeleteModal";
import PortfolioCreateModal from "../PortfolioCreateModal/PortfolioCreateModal";
import PortfolioUpdateModal from "../PortfolioUpdateModal/PortfolioUpdateModal";
import WatchlistCreateModal from "../WatchlistCreateModal/WatchlistCreateModal";
import WatchlistUpdateModal from "../WatchlistUpdateModal/WatchlistUpdateModal";
import WatchlistDeleteModal from "../WatchlistDeleteModal/WatchlistDeleteModal";
import "./ProfileButton.css"


function ProfileButton() {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
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
    (navigate('/'))
    .then(closeMenu())
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

              <p
              className="account-info"
              >
                {user.firstName} {user.lastName}
                </p>

              <p
              className="account-info"
              >
                {user.email}
                </p>


                <br/>
                <br/>

                <ln
            className='profile-line'
            ></ln>
                <NavLink
              to='/dashboard'
              className="nav-link-dropdown"
              >
              Dashboard
              </NavLink>

             <br/>

             <ln
            className='profile-line'
            ></ln>

              <br/>

              <NavLink
              to='/transfer'
              className="nav-link-dropdown"
              >
              Transfer Funds
              </NavLink>

              <br/>

              <ln
            className='profile-line'
            ></ln>

              <NavLink
              to='/learning-center'
              className="nav-link-dropdown"
              >
              Learning Center
              </NavLink>

              <br/>
              <ln
            className='profile-line'
            ></ln>

              <OpenModalButton
                buttonText="Create Portfolio"
                // onItemClick={closeMenu}
                modalComponent={<PortfolioCreateModal />}
                className="login"
              />

             <OpenModalButton
                buttonText="Update Portfolio"
                // onItemClick={closeMenu}
                modalComponent={<PortfolioUpdateModal />}
                className="login"
              />

              <OpenModalButton
                buttonText="Delete Portfolio"
                // onItemClick={closeMenu}
                modalComponent={<PortfolioDeleteModal />}
                className="login"
              /><br></br>

              <OpenModalButton
                buttonText="Create Watchlist"
                modalComponent={<WatchlistCreateModal />}
              />

              <OpenModalButton
                buttonText="Update Watchlist"
                modalComponent={<WatchlistUpdateModal />}
              />

              <OpenModalButton
                buttonText="Delete Watchlist"
                modalComponent={<WatchlistDeleteModal />}
              />

      <button
      onClick={logout}
       >
        Log Out
       </button>

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
