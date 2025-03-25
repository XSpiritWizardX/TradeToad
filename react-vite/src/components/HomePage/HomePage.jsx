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


    <img src='https://res.cloudinary.com/dl6ls3rgu/image/upload/v1742869032/trade-toad2_gltqdk.png'></img>

    <img src='https://res.cloudinary.com/dl6ls3rgu/image/upload/v1742869030/z1WTK1Mj22ptr4EX1tQc--0--wxhad-removebg-preview_qcwbkn.png'></img>



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
