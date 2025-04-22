import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchWatchlists} from "../../redux/watchlist"
import { fetchWatchlistCryptos } from "../../redux/watchlistCryptos";
import { fetchWatchlistStocks } from "../../redux/watchlistStocks";
import './Watchlist.css'


function Watchlist() {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.watchlist.watchlist || []);
  // const watchlistStocks = useSelector((state) => state.watchlistStocks);
  // const watchlistCryptos = useSelector((state) => state.watchlistCryptos);
   useEffect(() => {
        dispatch(fetchWatchlists());
        dispatch(fetchWatchlistStocks());
        dispatch(fetchWatchlistCryptos())
      }, [dispatch]);
  return (
    <div className="watchlist-container">



        {/* <h1
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

      </div> */}

<h1 className='current-head-text'>Watchlists</h1>
          {/* <p>{watchlist?.watchlists?.[0]?.name}</p>
          <p>{watchlist?.watchlists?.[1]?.name}</p>
          <p>{watchlist?.watchlists?.[2]?.name}</p>
          <p>{watchlist?.watchlists?.[3]?.name}</p>
          <p>{watchlist?.watchlists?.[4]?.name}</p>
          <p>{watchlist?.watchlists?.[5]?.name}</p>
          <p>{watchlist?.watchlists?.[6]?.name}</p> */}

{watchlist?.watchlists?.map((item, index) => (
  <div key={index} className='watch-stock-container'>
    <p className='para-watch'>{item.name}</p>
  </div>
))}





      {/* <h1
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

      </div> */}






    </div>
  );
}

export default Watchlist;
