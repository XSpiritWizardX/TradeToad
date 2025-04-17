

import { csrfFetch } from "./csrf";


const SET_STOCK = 'session/stocks';
const SET_ONE_STOCK = '/api/stocks/:stockId';
const REMOVE_STOCK = 'session/stocks';













const setStock = (user) => ({
  type: SET_STOCK,
  payload: user
});


const setOneStock = (stock) => ({
    type: SET_ONE_STOCK,
    stock,
  });

const removeStockId = () => ({
  type: REMOVE_STOCK
});
















export const fetchStocks = () => async (dispatch) => {
    const response = await fetch("/api/stocks/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setStock(data));
    }
};





export const fetchOneStock = (stockId) => async (dispatch) => {
    const response = await fetch(`/api/stocks/${stockId}`);
    console.log(response)
    if (response.ok) {

      const stock = await response.json();
      dispatch(setOneStock(stock));

    }
  };





export const deleteStock = (stockId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/stocks/${stockId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete stock");  // Prevents misleading success alerts
      }

      dispatch(removeStockId(stockId)); // Update Redux state
      return "Stock deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { stock: null };



function stockReducer(state = initialState, action) {
  switch (action.type) {



    case SET_STOCK:
        return { ...state, stock: action.payload };
    case SET_ONE_STOCK:
        return { stock: action.stock};
    case REMOVE_STOCK:{
        const newState = { ...state };
        delete newState.stocks[action.stockId];
        return newState;
      }
    default:
        return state;
  }
}



export default stockReducer;
