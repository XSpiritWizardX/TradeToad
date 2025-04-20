// import { csrfFetch } from "./csrf";

// reducer handles the stock data
const SET_ONE_STOCK_DATA = '/api/stocks/:symbol';

const setOneStockData = (stock) => ({
  type: SET_ONE_STOCK_DATA,
  payload: stock,
});


export const fetchOneStockData = (symbol) => async (dispatch) => {
  console.log("Fetching data for symbol:", symbol);
  try {
    const url = `/api/stocks/${symbol}`;
    console.log("API URL:", url);
    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (response.ok) {
      const stockData = await response.json();
      dispatch(setOneStockData(stockData));
      return stockData;
    } else {
      console.error("API error:", response.status, response.statusText);
      // might want to dispatch an error action here
    
    }
  } catch (error) {
    console.error("Error fetching stock data:", error);
    // might want to dispatch an error action here
  }
};

// Initial state
const initialState = {
  currentStock: null,
  loading: false,
  error: null
};

// Reducer
function stockDataReducer (state = initialState, action) {
  switch (action.type) {
    case SET_ONE_STOCK_DATA:
      return {
        ...state,
        currentStock: action.payload,
        loading: false,
        error: null
      };
    default:
      return state;
  }
}


export default stockDataReducer;


// // const SET_PORTFOLIO_STOCK = 'session/portfolio_stocks';
// const SET_ONE_STOCK_DATA = '/api/stocks/:symbol';
// // const REMOVE_PORTFOLIO_STOCK = 'session/portfolio_stocks';


// // const setPortfolioStock = (user) => ({
// //   type: SET_PORTFOLIO_STOCK,
// //   payload: user
// // });


// const setOneStockData = (stock) => ({
//     type: SET_ONE_STOCK_DATA,
//     payload: stock,
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



// export const fetchOneStockData = (symbol) => async (dispatch) => {
//   try {
//     const response = await fetch(`/api/stocks/${symbol}`);
//     console.log("Response", response);
    
//     if (response.ok) {
//       const stockData = await response.json();
//       dispatch(setOneStockData(stockData));
//       return stockData;
//     }
//   } catch (error) {
//     console.error("Error fetching stock data:", error);
//   }
// };



// // export const deletePortfolioStock = (portfolioStockId) => async (dispatch) => {
// //     try {
// //       const response = await csrfFetch(`/api/portfolio_stocks/${portfolioStockId}`, {
// //         method: "DELETE",
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to delete portfolio");  // Prevents misleading success alerts
// //       }

// //       dispatch(removePortfolioStockId(portfolioStockId)); // Update Redux state
// //       return "Portfolio Stock deleted successfully"; // Ensure frontend knows it worked
// //     } catch (error) {
// //       console.error("Delete Error:", error); // Log error to console
// //       throw error; // Ensures the frontend properly handles the failure
// //     }
// //   };


// const initialState = { stock_data: null };



// function stockDataReducer(state = initialState, action) {
//   switch (action.type) {




//     case SET_ONE_STOCK_DATA:
//         return { stock_data: action.stock_data};


//     default:
//         return state;
//   }
// }



// export default stockDataReducer;
