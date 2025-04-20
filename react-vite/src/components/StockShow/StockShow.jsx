// import { useSelector } from 'react-redux';
import { useSelector } from 'react-redux';
import './StockShow.css'
import { NavLink } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import BuyStockModal from '../BuyStockModal/BuyStockModal';
import SellStockModal from '../SellStockModal/SellStockModal'
import StockChart from '../StockChart/StockChart';
// import { useDispatch } from 'react-redux';
// import * as stockDataActions from '../../redux/stockPrices'
// import { useEffect } from 'react';
function StockShow() {



  // const { stockID } = useParams();
  // const {cryptoId} = useParams();
  // const {symbol} = useParams()
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  const user = useSelector(state => state.session.user)
  // const portfolios = useSelector(state => state.portfolio.portfolio || [])
  // const cryptos = useSelector(state => state.crypto?.crypto?.cryptos || []);
  // const stocks = useSelector(state => state.stock?.stock?.stocks || []);

  // useEffect(() => {
  //   // first, check if user is authenticated
  //   dispatch(stockDataActions.fetchOneStockData(symbol))

  // }, [dispatch]);
  // }, [dispatch, user]);





  return (
    <div className="dashboard-container">
       {/* Top section with StockChart and Trade menu side by side */}
      <div className='top-section'>

        <div className='chart-container'>
            <StockChart  />
        </div>



            <div className='user-trade-menu'>


                {user ? (

                  <>

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

                  </div>
                  </>
                  )
                  :
                  (
                    <>






                    <p>Technical data</p>

                    <div className='tech-data'>
                      <p>PRICE</p>
                      <p>VOLUME</p>
                      <p>VOLATILITY</p>
                      <p>MARKET-CAP</p>

                    </div>
                    </>
                  )
                }


            </div>
      </div>



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
          Developers Choices
      </h1>

      <div
      className='stock-choices-dashboard'
      >

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

    </div>
  );
}

export default StockShow;
