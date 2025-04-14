// import { useSelector } from 'react-redux';

import './StockShow.css'
import { NavLink, useParams } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import BuyStockModal from '../BuyStockModal/BuyStockModal';
import SellStockModal from '../SellStockModal/SellStockModal'
import StockChart from '../StockChart/StockChart';

function StockShow() {
//   const sessionUser = useSelector(state => state.session.user);
  // Redirect if not logged in
//   if (!sessionUser) return <Navigate to="/" />;
  const { stockID } = useParams();

  return (
    <div className="dashboard-container">
       {/* Top section with StockChart and Trade menu side by side */}
      <div className='top-section'>

        <div className='chart-container'>
            <StockChart symbol={stockID || "AAPL"} />
        </div>

            <div className='user-trade-menu'>
                <h1>Trade</h1>

                <div className='button-cont-stockshow'>

                  <OpenModalButton
                    className='buy-button'
                    buttonText="Buy"
                    // onItemClick={closeMenu}
                    modalComponent={<BuyStockModal />}
                  />

                  <OpenModalButton
                    className='sell-button'
                    buttonText="Sell"
                    // onItemClick={closeMenu}
                    modalComponent={<SellStockModal />}
                  />

                  <button className='add-watch-button'>
                    Add to watchlist
                  </button>

                </div>


                <p>Technical data</p>

                <div className='tech-data'>
                  <p>PRICE</p>
                  <p>VOLUME</p>
                  <p>VOLATILITY</p>
                  <p>MARKET-CAP</p>
                  <p>OPEN</p>
                  <p>CLOSE</p>
                  <p>HIGH</p>
                  <p>LOW</p>
                </div>
            </div>
      </div>

      {/* Reference image section - use this to see AAPL chart */}
        {/* <h1 className='stock-show-head-text'>
          APPL<br/>
        Apple
          <br/>
          $208.60
        </h1>
            <img src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743130771/apple-stock-example_pk547s.webp" alt="apple-example-image"
            className='example-apple-img'/> */}

        <div className='time-frame-container'>

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

        </div>


      <div className='foot-text'>
          <p>Tune in for more</p>
      </div>

      <h1 className='para-stock-choice'>
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

export default StockShow;
