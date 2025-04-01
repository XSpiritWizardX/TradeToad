import './HomePage.css'
import { useState } from 'react';
// import { useState, useEffect, useRef } from "react";
// import { useSelector } from "react-redux";

// import { NavLink } from 'react-router-dom';













function HomePage() {

  const [isToadVisible, setIsToadVisible] = useState(true)






  const handleToadClick = () => {
    setIsToadVisible(false);
    console.log('Image clicked! Visibility set to false.');

  }






  return (
    <div
    className='home-page'
    >




    <div
    className='textz'
    >
    <h1>Welcome To Trade Toad!</h1>
    <h3>
      Learn how to trade stocks and make money
    </h3>

    </div>







      {/* Begin Toad Jumps */}


      <div
      className='toad-group'
      >


        {isToadVisible && (


        <img
        src='https://res.cloudinary.com/dl6ls3rgu/image/upload/v1742869030/z1WTK1Mj22ptr4EX1tQc--0--wxhad-removebg-preview_qcwbkn.png'
        className='game-toad'
        onClick={handleToadClick}

        ></img>



        )}





      </div>


      {/* End Toad Jumps */}








    <p
    className='homepage-p-text'
    >
      Leap into the fun now.
      <br/>
       Sign up or Login to begin.
    </p>








{/* Use dashboard button only for dev purposes */}


{/* <NavLink
to='/dashboard'
className='foot-links'
>

      <button
      className='dashboard-button'
      >
        Dashboard
      </button>
    </NavLink> */}



{/* Begin Copywriting */}

        <h1

        >

        Learn. Trade. Grow.
        </h1>


<h1>

A Smarter Way to Master the Stock Market
</h1>

<p>

Whether you&apos;re a complete beginner or looking to sharpen your trading skills, <br/>our web app is designed to make learning the stock market simple, engaging, and effective.
</p>



<h1>Why Trade Toad?</h1>
        <p>

            Live Market Data:

            Real-time stock prices keep your practice sessions realistic.
            <br/>
            Risk-Free Trading: No real money needed—just smart strategies.
            <br/>
           Expert Support: Get help when you need it with dedicated trading resources and support.
           <br/>
           Learn & Improve: Track your progress and refine your skills with every trade.
           <br/>
           Portfolio Simulation: Build, manage, and tweak your virtual investment portfolio.
           <br/>
            Strategy Testing: Experiment with different trading methods to find what works best for you.
        </p>



<h1>

📡 Real-Time Market Data—Updated Every 60 Seconds
</h1>

<p>

Stay ahead of the game with live stock prices, trends, and market movements—updated every minute.
<br/>
 No outdated charts. No guesswork. Just real-time data at your fingertips.
</p>

<h1>

🎓 Comprehensive Learning Center
</h1>

<p>

Stock trading doesn&apos;t have to be complicated. Our interactive courses, bite-sized lessons,
<br/>
 and expert insights break everything down into easy-to-understand steps.
 <br/>
 Learn at your own pace, from the basics to advanced strategies.
</p>


<h1>

📊 Hands-On Trading Simulations
</h1>

<p>

Practice trading without the risk.
<br/>
Use virtual money to test strategies, experiment with trades,
<br/>
and gain confidence before investing real dollars.
</p>

<h1>

🔍 Market Insights & Expert Analysis
</h1>

<p>
Understand the why behind the numbers.
<br/>
Get insights from experienced traders,
<br/>
market trends, and news that impact your decisions.
</p>


<h1>

🚀 Your Journey to Smarter Trading Starts Here
<br/>
No prior experience needed—perfect for beginners
</h1>
<p>

Track your progress and build your own strategy
<br/>
Stay informed with minute-by-minute stock updates
<br/>
Learn at your own pace with a structured curriculum
<br/>
Join now and take your first step toward mastering the stock market!
</p>

<h1>

✅ Sign Up for Free & Start Learning Today!
</h1>




<ln>-------------<br/>-------------</ln>

{/* End copywriting */}




        {/* Begin Articles */}

        <div
        className='landing-page-copy'
        >

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <br/>
         Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
         <br/>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
         <br/>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>

        </div>

 {/* End Articles */}

    {/* <footer
    className="foot"
    >

      <h5>App Data && Resources</h5>
      <a to='/resources'
      className='resources'
      >
        resources
        </a>
    </footer> */}


  </div>

  );

}

export default HomePage;
