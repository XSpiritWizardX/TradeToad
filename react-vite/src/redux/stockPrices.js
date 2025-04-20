

// import { csrfFetch } from "./csrf";


// const SET_PORTFOLIO_STOCK = 'session/portfolio_stocks';
const SET_ONE_STOCK_DATA = '/api/stocks/:symbol';
// const REMOVE_PORTFOLIO_STOCK = 'session/portfolio_stocks';













// const setPortfolioStock = (user) => ({
//   type: SET_PORTFOLIO_STOCK,
//   payload: user
// });


const setOneStockData = (stock) => ({
    type: SET_ONE_STOCK_DATA,
    payload:stock,
  });

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





export const fetchOneStockData = (symbol) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${symbol}`);
    console.log(response)
    if (response.ok) {

      const stockData = await response.json();
      dispatch(setOneStockData(stockData));

    }
  };





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
























const initialState = { stock_data: null };



function stockDataReducer(state = initialState, action) {
  switch (action.type) {




    case SET_ONE_STOCK_DATA:
        return { stock_data: action.stock_data};


    default:
        return state;
  }
}



export default stockDataReducer;
