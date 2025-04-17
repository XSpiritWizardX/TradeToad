// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchPortfolios } from "../../redux/portfolio";
import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
import './CurrentStocks.css'


function CurrentStocksCard() {
    const dispatch = useDispatch();
    // const portfolios = useSelector(state => state.portfolio.portfolio || [])
    // const portfolioStocks = useSelector(state => state.portfolio_stock.portfolio_stock || [])


    useEffect(() => {
        dispatch(fetchPortfolios());
        dispatch(fetchPortfolioStocks())
      }, [dispatch]);

  return (
    <div className="current-stocks-container">



      <h1
      className='current-head-text'
      >
       Crypto
        </h1>


      <div
      className='watch-stock-container'
      >

        <p
        className='para-watch'
        >
            stock name
            </p>
        <p
        className='para-watch'
        >
            stock price
            </p>
        <p
        className='para-watch'
        >
            percentage change ^%
            </p>

      </div>







      <h1
      className='current-head-text'
      >
       Stocks
         </h1>


        <div
      className='watch-stock-container'
      >

        <p
        className='para-watch'
        >
            {/* {stock?.name} */}
            </p>
        <p
        className='para-watch'
        >
            stock price
            </p>
        <p
        className='para-watch'
        >
            percentage change ^%
            </p>

      </div>










    </div>
  );
}

export default CurrentStocksCard;
