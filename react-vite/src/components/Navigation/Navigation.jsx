import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { FcSearch } from "react-icons/fc";
import "./Navigation.css";
// import {apiCall} from "../../../../app/api/polygon/client.py"
// import * as stockActions from '../../redux/stocks';
// import { useSelector, useDispatch } from "react-redux";
// import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";




function Navigation() {
// const [errors , setErrors] = useState("")
const [symbol, setSymbol] = useState("")
  // const user = useSelector(state => state.session.user)

  const handleSubmit = async () => {
    // e.preventDefault();







        Navigate(`/api/stocks/${symbol}`)





  };


  return (
    <div className="header">

        <NavLink to="/">
          {/* <img className='home-image' src='https://res.cloudinary.com/dl6ls3rgu/image/upload/v1742868928/40D78BCF-EF7D-4B06-8CE2-51617E5A0AA7_kuigij.png' /> */}
          <img className='home-image' src='https://res.cloudinary.com/dl6ls3rgu/image/upload/v1744339363/A0M8kXCgqNXyPMytxIoo--0--e9tsq-removebg-preview_rkvcan.png' />
        </NavLink>

        <img
          src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743177193/text-1743177174588_mr9aoq.png"
          alt="banner-trade-toad"
          className="trade-toad-banner"
        />
          <p
          className="instructions-for-search"
          >
          search for a stock or crypto like
          NFLX or X:BTCUSD
          </p>

        <div className="search-container">


          <form onSubmit={handleSubmit}>

          <input
            className="search-text-input"
            placeholder="search for a stock"
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}

            >
          </input>
          <button
          className="navy-icon-search-button"
          // onClick={handleSubmit()}
          >

          <FcSearch className="search-icon" />
          </button>
            </form>


        </div>

        <ProfileButton className="profile-button" />

    </div>
  );
}

export default Navigation;
