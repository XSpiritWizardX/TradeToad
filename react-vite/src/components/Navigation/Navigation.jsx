import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  return (
    <div
    className="header"
    >

        <NavLink to="/">
        {/* Home || TRADE TOAD  IMAGE */}
        <img className='home-image' src='https://cdn.discordapp.com/attachments/1352078167824924682/1352877211840942210/40D78BCF-EF7D-4B06-8CE2-51617E5A0AA7.png?ex=67df9c96&is=67de4b16&hm=6fe13d32ebec406f68690a1f840f83717e24b6061b07d538a4f0ab093ed4b0a1&' />

        </NavLink>



        <ProfileButton />

    </div>
  );
}

export default Navigation;
