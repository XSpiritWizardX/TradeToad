import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { FcSearch } from "react-icons/fc";
import "./Navigation.css";

function Navigation() {
  return (
    <div
    className="header"
    >

        <NavLink to="/">
        {/* Home || TRADE TOAD  IMAGE */}
        <img className='home-image' src='https://res.cloudinary.com/dl6ls3rgu/image/upload/v1742868928/40D78BCF-EF7D-4B06-8CE2-51617E5A0AA7_kuigij.png' />

        </NavLink>



        <img
        src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743177193/text-1743177174588_mr9aoq.png"
         alt="banner-trade-toad"
         className="trade-toad-banner"
         />



        

        <div
        className="search-container"
        >

        <FcSearch
        className="search-icon"
        />
        <input
        className="search-text-input"
        placeholder="search for a stock"
        ></input>

        </div>





        <ProfileButton
        className="profile-button"
        />




    </div>
  );
}

export default Navigation;
