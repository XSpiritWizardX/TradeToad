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






// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWatchlists } from "../../redux/watchlist";
// import { fetchWatchlistCryptos } from "../../redux/watchlistCryptos";
// import { fetchWatchlistStocks } from "../../redux/watchlistStocks";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";
// import WatchlistCreateModal from "../WatchlistCreateModal/WatchlistCreateModal";
// import './Watchlist.css';

// function Watchlist() {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const sessionUser = useSelector(state => state.session.user);
  
//   // Get watchlist data from Redux store
//   const watchlistData = useSelector((state) => state.watchlist.watchlist || {});
//   const watchlists = watchlistData.watchlists || [];
  
//   // Get watchlist stocks and cryptos
//   const watchlistStocks = useSelector((state) => state.watchlistStocks.watchlistStocks || []);
//   const watchlistCryptos = useSelector((state) => state.watchlistCryptos.watchlistCryptos || []);
  
//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         await dispatch(fetchWatchlists());
//         await dispatch(fetchWatchlistStocks());
//         await dispatch(fetchWatchlistCryptos());
//       } catch (error) {
//         console.error("Error loading watchlist data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     if (sessionUser) {
//       loadData();
//     } else {
//       setIsLoading(false);
//     }
//   }, [dispatch, sessionUser]);

//   // Function to get stocks/cryptos for a specific watchlist
//   const getWatchlistItems = (watchlistId) => {
//     const stocks = watchlistStocks.filter(stock => stock.watchlist_id === watchlistId);
//     const cryptos = watchlistCryptos.filter(crypto => crypto.watchlist_id === watchlistId);
    
//     return { stocks, cryptos };
//   };

//   if (!sessionUser) {
//     return (
//       <div className="watchlist-container sidebar-section">
//         <div className="watchlist-header">
//           <h2>My Watchlists</h2>
//         </div>
//         <div className="no-watchlists">
//           <p>Please log in to view your watchlists.</p>
//         </div>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="watchlist-container sidebar-section">
//         <div className="watchlist-header">
//           <h2>My Watchlists</h2>
//         </div>
//         <div className="watchlist-loading">Loading watchlists...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="watchlist-container sidebar-section">
//       <div className="watchlist-header">
//         <h2>My Watchlists</h2>
//         <OpenModalButton
//           buttonText="+"
//           modalComponent={<WatchlistCreateModal />}
//           className="create-watchlist-button"
//         />
//       </div>
      
//       {watchlists.length === 0 ? (
//         <div className="no-watchlists">
//           <p>You don&apos;t have any watchlists yet.</p>
//           <p>Create a watchlist to track your favorite assets.</p>
//         </div>
//       ) : (
//         <div className="watchlists-list">
//           {watchlists.map(watchlist => {
//             const { stocks, cryptos } = getWatchlistItems(watchlist.id);
//             const totalItems = stocks.length + cryptos.length;
            
//             return (
//               <div key={watchlist.id} className="watchlist-card">
//                 <div className="watchlist-name-row">
//                   <h3 className="watchlist-name">{watchlist.name}</h3>
//                   <span className="item-count">{totalItems} items</span>
//                 </div>
                
//                 {totalItems > 0 ? (
//                   <div className="watchlist-preview">
//                     {/* Show up to 3 stocks */}
//                     {stocks.slice(0, 3).map(stock => (
//                       <div key={`stock-${stock.id}`} className="watchlist-item">
//                         <div className="item-symbol">{stock.symbol}</div>
//                         <div className={`item-change ${parseFloat(stock.percent_change) >= 0 ? 'positive' : 'negative'}`}>
//                           {parseFloat(stock.percent_change) >= 0 ? '+' : ''}{stock.percent_change}%
//                         </div>
//                       </div>
//                     ))}
                    
//                     {/* Show up to 3 cryptos if there's room */}
//                     {cryptos.slice(0, Math.max(0, 3 - stocks.length)).map(crypto => (
//                       <div key={`crypto-${crypto.id}`} className="watchlist-item">
//                         <div className="item-symbol">{crypto.symbol}</div>
//                         <div className={`item-change ${parseFloat(crypto.percent_change) >= 0 ? 'positive' : 'negative'}`}>
//                           {parseFloat(crypto.percent_change) >= 0 ? '+' : ''}{crypto.percent_change}%
//                         </div>
//                       </div>
//                     ))}
                    
//                     {/* Show "View more" if there are more than 3 items */}
//                     {totalItems > 3 && (
//                       <div className="view-more">
//                         +{totalItems - 3} more items
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="empty-watchlist">
//                     <p>This watchlist is empty</p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


// export default Watchlist;





  // return (
  //   <div className="watchlist-container">

  //       <h1
  //       className='current-head-text'
  //       >Crypto</h1>

  //     <div
  //     className='watch-stock-container'
  //     >

  //       <p
  //       className='para-watch'
  //       >
  //           stock name
  //           </p>
  //       <p
  //       className='para-watch'
  //       >
  //           stock price
  //           </p>
  //       <p
  //       className='para-watch'
  //       >
  //           percentage change ^%
  //           </p>

  //     </div>

  //     <h1
  //     className='current-head-text'
  //     >
  //       Stocks
  //     </h1>

  //     <div
  //     className='watch-stock-container'
  //     >

  //       <p
  //       className='para-watch'
  //       >
  //           stock name
  //           </p>
  //       <p
  //       className='para-watch'
  //       >
  //           stock price
  //           </p>
  //       <p
  //       className='para-watch'
  //       >
  //           percentage change ^%
  //           </p>

  //     </div>
  //   </div>
  // );
// }


// export default Watchlist;
