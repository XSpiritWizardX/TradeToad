

import { csrfFetch } from "./csrf";


const SET_CRYPTO_TRANSACTION = 'session/crypto_transactions';
const SET_ONE_CRYPTO_TRANSACTION = '/api/crypto_transactions/:cryptoTransactionId';
const REMOVE_CRYPTO_TRANSACTION = 'session/crypto_transactions';













const setCryptoTransaction = (user) => ({
  type: SET_CRYPTO_TRANSACTION,
  payload: user
});


const setOneCryptoTransaction = (crypto_transaction) => ({
    type: SET_ONE_CRYPTO_TRANSACTION,
    crypto_transaction,
  });

const removeCryptoTransactionId = () => ({
  type: REMOVE_CRYPTO_TRANSACTION
});
















export const fetchPCryptoTransaction = () => async (dispatch) => {
    const response = await fetch("/api/crypto_transactions/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setCryptoTransaction(data));
    }
};





export const fetchOneCryptoTransaction = (cryptoTransactionId) => async (dispatch) => {
    const response = await fetch(`/api/crypto_transactions/${cryptoTransactionId}`);
    console.log(response)
    if (response.ok) {

      const cryptoTransaction = await response.json();
      dispatch(setOneCryptoTransaction(cryptoTransaction));

    }
  };





export const deleteCryptoTransaction = (cryptoTransactionId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/crypto_transactions/${cryptoTransactionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete CryptoTransaction");  // Prevents misleading success alerts
      }

      dispatch(removeCryptoTransactionId(cryptoTransactionId)); // Update Redux state
      return "CryptoTransaction deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { crypto_transaction: null };



function cryptoTransactionReducer(state = initialState, action) {
  switch (action.type) {



    case SET_CRYPTO_TRANSACTION:
        return { ...state, crypto_transaction: action.payload };
    case SET_ONE_CRYPTO_TRANSACTION:
        return { crypto_transaction: action.crypto_transaction};
    case REMOVE_CRYPTO_TRANSACTION:{
        const newState = { ...state };
        delete newState.crypto_transaction[action.cryptoTransactionId];
        return newState;
      }
    default:
        return state;
  }
}



export default cryptoTransactionReducer;
