

// import { csrfFetch } from "./csrf";


// const SET_WATCHLIST_STOCK = 'session/watchlist_stocks';
// const SET_ONE_WATCHLIST_STOCK = '/api/watchlist_stocks/:watchlistStockId';
// const REMOVE_WATCHLIST_STOCK = 'session/watchlist_stocks';













// const setWatchlistStock = (user) => ({
//   type: SET_WATCHLIST_STOCK,
//   payload: user
// });


// const setOneWatchlistStock = (watchlist) => ({
//     type: SET_ONE_WATCHLIST_STOCK,
//     watchlist,
//   });

// const removeWatchlistStockId = () => ({
//   type: REMOVE_WATCHLIST_STOCK
// });
















// export const fetchWatchlistStocks = () => async (dispatch) => {
//     const response = await fetch("/api/watchlist_stocks/");
//     if (response.ok) {
//         const data = await response.json();
//         if (data.errors) {
//             return;
//         }

//         dispatch(setWatchlistStock(data));
//     }
// };





// export const fetchOneWatchlistStock = (watchlistStockId) => async (dispatch) => {
//     const response = await fetch(`/api/watchlist_stocks/${watchlistStockId}`);
//     console.log(response)
//     if (response.ok) {

//       const watchlist_stock = await response.json();
//       dispatch(setOneWatchlistStock(watchlist_stock));

//     }
//   };





// export const deleteWatchlistStock = (watchlistStockId) => async (dispatch) => {
//     try {
//       const response = await csrfFetch(`/api/watchlist_stocks/${watchlistStockId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete watchlist");  // Prevents misleading success alerts
//       }

//       dispatch(removeWatchlistStockId(watchlistStockId)); // Update Redux state
//       return "watchlist Stock deleted successfully"; // Ensure frontend knows it worked
//     } catch (error) {
//       console.error("Delete Error:", error); // Log error to console
//       throw error; // Ensures the frontend properly handles the failure
//     }
//   };
























// const initialState = { watchlist_stock: null };



// function watchlistStockReducer(state = initialState, action) {
//   switch (action.type) {



//     case SET_WATCHLIST_STOCK:
//         return { ...state, watchlist_stock: action.payload };
//     case SET_ONE_WATCHLIST_STOCK:
//         return { watchlist_stock: action.watchlist_stock};
//     case REMOVE_WATCHLIST_STOCK:{
//         const newState = { ...state };
//         delete newState.watchlist_stock[action.watchlistStockId];
//         return newState;
//       }
//     default:
//         return state;
//   }
// }



// export default watchlistStockReducer
