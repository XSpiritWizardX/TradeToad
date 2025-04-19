// import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import PortfolioCard from '../../components/Portfolio/Portfolio';
import WatchlistCard from '../../components/Watchlist/Watchlist'
import CurrentStocksCard from '../CurrentStocks/CurrentStocks';

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../../redux/portfolio";
import { fetchCryptos } from '../../redux/cryptos';
import { fetchStocks } from '../../redux/stocks';
import { thunkAuthenticate } from '../../redux/session';

import './Dashboard.css'


function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(state => state.session.user)
  const portfolios = useSelector(state => state.portfolio.portfolio || [])
  // const cryptos = useSelector(state => state.crypto?.crypto?.cryptos || []);
  // const stocks = useSelector(state => state.stock?.stock?.stocks || []);

  useEffect(() => {
    // first, check if user is authenticated 
    dispatch(thunkAuthenticate())
      .then((userData) => {
        if (!userData) {
          // if not authenticated, redirect to login
          navigate('/login');
          return;
        }
      // if authenticated, fetch data
      return Promise.all([
        dispatch(fetchPortfolios()),
        dispatch(fetchCryptos()),
        dispatch(fetchStocks()),
      ]);
    })
      .catch(err => {
          console.error("Authentication error:", err);
          navigate('/login');   // redirect to login)
      })
      .finally(() => {
        setIsLoading(false);
      })
  }, [dispatch, navigate]);
  // }, [dispatch, user]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in to view your dashboard</div>
  }

  return (
    <div className="dashboard-container">

      <h1>
        Welcome, {user?.firstName} {user?.lastName} !
      </h1>

      <div className="dashboard-content">
        <PortfolioCard className="portfolio-card"/>

        <div className='current-stock-and-watchlist'>
          <h1 className='side-bar-header-text'>Portfolio</h1>

        <CurrentStocksCard className='current-stock-card'/>

        <h1 className='side-bar-header-text'>Watchlist</h1>
        <WatchlistCard className='watchlist-card'/>
        
        </div>
      </div>

        <div className='time-frame-container'>

        <button className='time-frame'>
          Live
        </button>
        
        <button className='time-frame'>
          1 Day
        </button>
        
        <button className='time-frame'>
          1 Week
        </button>
        
        <button className='time-frame'>
          1 Month
        </button>

        <button className='time-frame'>
          3 Months
        </button>

        <button className='time-frame'>
          1 Year
        </button>

        <button className='time-frame'>
          All Time
        </button>

        <h1 className='dash-head-text'>
          Available Cash = ${portfolios?.portfolios?.[0]?.available_cash}
        </h1>
        </div>

        <div className='foot-text'>
            <p>Tune in for more</p>
        </div>

        <div className='landing-page-copy'>
          <div>
          <h3>Article</h3>
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
          <div>
          <h3>Article</h3>
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
          <div>
          <h3>Article</h3>
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
          <div>
          <h3>Article</h3>
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
          <div>
          <h3>Article</h3>
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
          <div>
          <h3>Article</h3>
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

        </div>

        <h1
      className='para-stock-choice'
      >
      Stock Choices
      </h1>



{/* MAP THROUGH STOCKS */}

        <div className='stock-choices-dashboard'>

          <NavLink
            className="stock-choices-card"
            to='/stocks/AAPL'
          >
            <button>
              APPLE
            </button>
          </NavLink>

          <NavLink
            to='/stocks/META'
              className="stock-choices-card"
          >
            <button>
              FACEBOOK
            </button>
          </NavLink>

          <NavLink
            to='/stocks/AMZN'
              className="stock-choices-card"
          >
            <button>
              AMAZON
            </button>
          </NavLink>

          <NavLink
            to='/stocks/TSLA'
              className="stock-choices-card"
          >
            <button>
              TESLA
            </button>
          </NavLink>

          <NavLink
            to='/stocks/GOOGL'
              className="stock-choices-card"
          >
            <button>
              GOOGLE
            </button>
          </NavLink>


          <NavLink
            to='/stocks/NFLX'
              className="stock-choices-card"
          >
            <button>
              NETFLIX
            </button>
          </NavLink>


          <NavLink
            to='/stocks/X:BTCUSD'
              className="stock-choices-card"
          >
            <button>
              BITCOIN
            </button>
          </NavLink>

          <NavLink
            to='/stocks/X:DOGEUSD'
              className="stock-choices-card"
          >
            <button>
              DOGECOIN
            </button>
          </NavLink>

          <NavLink
            to='/stocks/X:ETHUSD'
              className="stock-choices-card"
          >
            <button>
              ETHEREUM
            </button>
          </NavLink>

          <NavLink
            to='/stocks/X:LINKUSD'
              className="stock-choices-card"
          >
            <button>
              CHAINLINK
            </button>
          </NavLink>

          <NavLink
            to='/stocks/X:XRPUSD'
              className="stock-choices-card"
          >
            <button>
              XRP
            </button>
          </NavLink>


           </div>





{/* MAPP THOUGH CRYPTOS */}

           <div>












          </div>






    </div>
  );
}

export default Dashboard;
