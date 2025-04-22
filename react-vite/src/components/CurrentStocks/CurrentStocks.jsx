// import { useSelector } from 'react-redux';
// import { NavLink } from 'react-router-dom';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchPortfolios } from "../../redux/portfolio";
import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
import { fetchPortfolioCryptos } from "../../redux/portfolioCryptos";
import './CurrentStocks.css'
import { useSelector } from "react-redux";

function CurrentStocksCard() {
    const dispatch = useDispatch();
    // const portfolios = useSelector(state => state.portfolio.portfolio || [])
    const portfolio_stock = useSelector(state => state.portfolioStock.portfolio_stock || [])


    useEffect(() => {
        dispatch(fetchPortfolios());
        dispatch(fetchPortfolioStocks());
        dispatch(fetchPortfolioCryptos())
      }, [dispatch]);

  return (
    <div className="current-stocks-container">



      {/* <h1
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

      </div> */}





{/* <p>
        {portfolio_stock?.portfolio_stocks?.[0]?.stock_id}

</p> */}

      <h1
      className='current-head-text'
      >
       Stocks
         </h1>


        <div
      className='current-stock-container'
      >

{portfolio_stock?.portfolio_stocks?.map((item, index) => (
  <div key={index} className='current-stockz'>

    <p className='port-stocks'>stock_id: .{item.stock_id}</p>

    <p className='port-stocks'>port: .{item.portfolio_id}</p>
    <p className='port-stocks'>Quantity: .{item.quantity}</p>

    <div
    className="current-stock-button-container"
    >

    <button
    className="buy-button-on-currentstocks"
    >
      Buy
      </button>
    <button
    className="sell-button-on-currentstocks"
    >
      Sell
      </button>

      </div>


  </div>
))}

      </div>










    </div>
  );
}

export default CurrentStocksCard;





// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchPortfolios } from "../../redux/portfolio";
// import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
// import { fetchPortfolioCryptos } from "../../redux/portfolioCryptos";
// import './CurrentStocks.css'

// function CurrentStocksCard() {
//     const dispatch = useDispatch();
//     // Uncomment and use the selectors to get data from Redux store
//     // const portfolios = useSelector(state => state.portfolio.portfolio || []);
//     const portfolioStocks = useSelector(state => state.portfolio_stock.portfolio_stock || []);
//     const portfolioCryptos = useSelector(state => state.portfolio_crypto.portfolio_crypto || []);

//     useEffect(() => {
//         dispatch(fetchPortfolios());
//         dispatch(fetchPortfolioStocks());
//         dispatch(fetchPortfolioCryptos());
//     }, [dispatch]);

//     return (
//         <div className="current-stocks-container">
//             <h1 className='current-head-text'>Crypto</h1>

//             {portfolioCryptos.length > 0 ? (
//                 portfolioCryptos.map((crypto) => (
//                     <div key={crypto.id} className='watch-stock-container'>
//                         <p className='para-watch'>{crypto.name || crypto.symbol}</p>
//                         <p className='para-watch'>${crypto.price?.toFixed(2) || 'N/A'}</p>
//                         <p className='para-watch'>
//                             {crypto.percentageChange ? `${crypto.percentageChange > 0 ? '+' : ''}${crypto.percentageChange.toFixed(2)}%` : 'N/A'}
//                         </p>
//                     </div>
//                 ))
//             ) : (
//                 <div className='watch-stock-container'>
//                     <p className='para-watch'>No cryptocurrencies in portfolio</p>
//                 </div>
//             )}

//             <h1 className='current-head-text'>Stocks</h1>

//             {portfolioStocks.length > 0 ? (
//                 portfolioStocks.map((stock) => (
//                     <div key={stock.id} className='watch-stock-container'>
//                         <p className='para-watch'>{stock.company || stock.symbol}</p>
//                         <p className='para-watch'>${stock.price?.toFixed(2) || 'N/A'}</p>
//                         <p className='para-watch'>
//                             {stock.percentageChange ? `${stock.percentageChange > 0 ? '+' : ''}${stock.percentageChange.toFixed(2)}%` : 'N/A'}
//                         </p>
//                     </div>
//                 ))
//             ) : (
//                 <div className='watch-stock-container'>
//                     <p className='para-watch'>No stocks in portfolio</p>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default CurrentStocksCard;
