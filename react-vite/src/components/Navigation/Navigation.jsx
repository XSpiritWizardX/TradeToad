import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import SearchBar from "../SearchBar/SearchBar";
// import { FcSearch } from "react-icons/fc";
import "./Navigation.css";

function Navigation() {
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

        <SearchBar className="search-bar" />


        <ProfileButton className="profile-button" />

    </div>
  );
}

export default Navigation;
