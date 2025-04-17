// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PortfolioCard from '../../components/Portfolio/Portfolio';
import WatchlistCard from '../../components/Watchlist/Watchlist'
import CurrentStocksCard from '../CurrentStocks/CurrentStocks';


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../../redux/portfolio";




import './Dashboard.css'







function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const portfolios = useSelector(state => state.portfolio.portfolio || [])


  useEffect(() => {
    dispatch(fetchPortfolios());
  }, [dispatch]);

  return (
    <div className="dashboard-container">



      <h1>
        Welcome, {user?.firstName} {user?.lastName} !
        </h1>




        {/* <div
        className='top-port-text-and-buttons'
        > */}

        {/* <div
        className='port-head-text'
        >

        <h1
        className='dash-head-text'
        >Investing ... $123456789</h1>
        <h1
        className='dash-head-text'
        >2030%^</h1>

        </div> */}





        {/* <div
        className='buttonsz'
        >

        <button
        className='fund-me'
        >Fund Your Portfolio</button>

        <button
        className='withdraw'
        >Withdraw</button>

        </div> */}

        {/* </div> */}









      <div className="dashboard-content">
        <PortfolioCard
        className="portfolio-card"
        />



        <div
        className='current-stock-and-watchlist'
        >
          <h1
          className='side-bar-header-text'
          >Portfolio</h1>
        <CurrentStocksCard
        className='current-stock-card'
        />

        <h1
        className='side-bar-header-text'
        >Watchlist</h1>
        <WatchlistCard
        className='watchlist-card'
        />
        </div>




      </div>


        <div
        className='time-frame-container'
        >

        <button
        className='time-frame'
        >
          Live
        </button>
        <button
        className='time-frame'
        >
          1 Day
        </button>
        <button
        className='time-frame'
        >
          1 Week
        </button>
        <button
        className='time-frame'
        >
          1 Month
        </button>
        <button
        className='time-frame'
        >
          3 Months
        </button>
        <button
        className='time-frame'
        >
          1 Year
        </button>
        <button
        className='time-frame'
        >
          All Time
        </button>

        <h1
        className='dash-head-text'
        >
          Available Cash = ${portfolios?.portfolios[0]?.available_cash}
        </h1>
        </div>








        <div
        className='foot-text'
        >
            <p>Tune in for more</p>
        </div>

        <div
        className='landing-page-copy'
        >
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
      Stock Choices // Biggest Movers
      </h1>
          <div
          className='stock-choices-dashboard'
          >


              <NavLink
                className="stock-choices-card"
                to='/stocks/:stockID'
              >
                <button>
                  Stock #1
                </button>
              </NavLink>

              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #2
                </button>
              </NavLink>

              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #3
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #4
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #5
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #6
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #7
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #8
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #9
                </button>
              </NavLink>


              <NavLink
               to='/stocks/:stockID'
                  className="stock-choices-card"
              >
                <button>
                  Stock #10
                </button>
              </NavLink>

          </div>






    </div>
  );
}

export default Dashboard;
