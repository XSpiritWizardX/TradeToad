

// import { csrfFetch } from "./csrf";


// const SET_PORTFOLIO_STOCK = 'session/portfolio_stocks';
// const SET_ONE_PORTFOLIO_STOCK = '/api/portfolio_stocks/:portfolioStockId';
// const REMOVE_PORTFOLIO_STOCK = 'session/portfolio_stocks';













// const setPortfolioStock = (user) => ({
//   type: SET_PORTFOLIO_STOCK,
//   payload: user
// });


// const setOnePortfolioStock = (portfolio) => ({
//     type: SET_ONE_PORTFOLIO_STOCK,
//     portfolio,
//   });

// const removePortfolioStockId = () => ({
//   type: REMOVE_PORTFOLIO_STOCK
// });
















// export const fetchPortfolioStocks = () => async (dispatch) => {
//     const response = await fetch("/api/portfolio_stocks/");
//     if (response.ok) {
//         const data = await response.json();
//         if (data.errors) {
//             return;
//         }

//         dispatch(setPortfolioStock(data));
//     }
// };





// export const fetchOnePortfolioStock = (portfolioStockId) => async (dispatch) => {
//     const response = await fetch(`/api/portfolio_stocks/${portfolioStockId}`);
//     console.log(response)
//     if (response.ok) {

//       const portfolio_stock = await response.json();
//       dispatch(setOnePortfolioStock(portfolio_stock));

//     }
//   };





// export const deletePortfolioStock = (portfolioStockId) => async (dispatch) => {
//     try {
//       const response = await csrfFetch(`/api/portfolio_stocks/${portfolioStockId}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete portfolio");  // Prevents misleading success alerts
//       }

//       dispatch(removePortfolioStockId(portfolioStockId)); // Update Redux state
//       return "Portfolio Stock deleted successfully"; // Ensure frontend knows it worked
//     } catch (error) {
//       console.error("Delete Error:", error); // Log error to console
//       throw error; // Ensures the frontend properly handles the failure
//     }
//   };
























// const initialState = { portfolio_stock: null };



// function portfolioStockReducer(state = initialState, action) {
//   switch (action.type) {



//     case SET_PORTFOLIO_STOCK:
//         return { ...state, portfolio_stock: action.payload };
//     case SET_ONE_PORTFOLIO_STOCK:
//         return { portfolio_stock: action.portfolio_stock};
//     case REMOVE_PORTFOLIO_STOCK:{
//         const newState = { ...state };
//         delete newState.portfolio_stock[action.portfolioStockId];
//         return newState;
//       }
//     default:
//         return state;
//   }
// }



// export default portfolioStockReducer;
