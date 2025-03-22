import './HomePage.css'

// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";




function ProfileButton() {








  return (
    <div
    className='page'
    >

    <div
    className='textz'
    >
    <h1>Welcome To Trade Toad!</h1>
    <h3>
      Learn how to trade stocks and make money
    </h3>

    </div>


    <img src='https://media.discordapp.net/attachments/1352078167824924682/1352877213758001152/168DA8D9-29E4-4C6F-944A-C7FB3ED2EAAD.png?ex=67e04557&is=67def3d7&hm=3d48e132907ffa136d8a22614c5c9295434befe7fb70b4af963966a25c5f3c47&=&format=webp&quality=lossless&width=800&height=800'></img>

    <p>
      Leap into the fun now.
      <br/>
       Sign up or Login to begin.
    </p>





    <footer
    className="foot"
    >

      <h5>App Data && resources</h5>
      <a to='/resources'
      className='resources'
      >
        resources
        </a>
    </footer>





  </div>
  );
}

export default ProfileButton;
