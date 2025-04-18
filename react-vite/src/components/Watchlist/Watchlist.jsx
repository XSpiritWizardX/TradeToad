import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {fetchWatchlists} from "../../redux/watchlist"
import { fetchWatchlistCryptos } from "../../redux/watchlistCryptos";
import { fetchWatchlistStocks } from "../../redux/watchlistStocks";
import './Watchlist.css'


function Watchlist() {
  const dispatch = useDispatch();
  // Redirect if not logged in
//   if (!sessionUser) return <Navigate to="/" />;
   useEffect(() => {
        dispatch(fetchWatchlists());
        dispatch(fetchWatchlistStocks());
        dispatch(fetchWatchlistCryptos())
      }, [dispatch]);
  return (
    <div className="watchlist-container">
      {/* <h1
      className='watchlist-title'
      >Watchlist</h1> */}


        <h1
        className='current-head-text'
        >Crypto</h1>

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






    </div>
  );
}

export default Watchlist;
