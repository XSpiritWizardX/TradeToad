

import { csrfFetch } from "./csrf";


const SET_STOCK_TRANSACTION = 'session/stock_transactions';
const SET_ONE_STOCK_TRANSACTION = '/api/stock_transactions/:stockTransactionId';
const REMOVE_STOCK_TRANSACTION = 'session/stock_transactions';













const setStockTransaction = (user) => ({
  type: SET_STOCK_TRANSACTION,
  payload: user
});


const setOneStockTransaction = (stock_transaction) => ({
    type: SET_ONE_STOCK_TRANSACTION,
    stock_transaction,
  });

const removeStockTransactionId = () => ({
  type: REMOVE_STOCK_TRANSACTION
});
















export const fetchPStockTransaction = () => async (dispatch) => {
    const response = await fetch("/api/stock_transactions/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setStockTransaction(data));
    }
};





export const fetchOneStockTransaction = (stockTransactionId) => async (dispatch) => {
    const response = await fetch(`/api/stock_transactions/${stockTransactionId}`);
    console.log(response)
    if (response.ok) {

      const stockTransaction = await response.json();
      dispatch(setOneStockTransaction(stockTransaction));

    }
  };





export const deleteStockTransaction = (stockTransactionId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/stock_transactions/${stockTransactionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete stockTransaction");  // Prevents misleading success alerts
      }

      dispatch(removeStockTransactionId(stockTransactionId)); // Update Redux state
      return "CryptoTransaction deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { stock_transaction: null };



function stockTransactionReducer(state = initialState, action) {
  switch (action.type) {



    case SET_STOCK_TRANSACTION:
        return { ...state, stock_transaction: action.payload };
    case SET_ONE_STOCK_TRANSACTION:
        return { stock_transaction: action.stock_transaction};
    case REMOVE_STOCK_TRANSACTION:{
        const newState = { ...state };
        delete newState.stock_transaction[action.stockTransactionId];
        return newState;
      }
    default:
        return state;
  }
}



export default stockTransactionReducer;
