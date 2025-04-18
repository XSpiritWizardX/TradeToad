

import { csrfFetch } from "./csrf";


const SET_CRYPTO = 'session/cryptos';
const SET_ONE_CRYPTO = '/api/cryptos/:cryptoId';
const REMOVE_CRYPTO = 'session/cryptos';













const setCrypto = (user) => ({
  type: SET_CRYPTO,
  payload: user
});


const setOneCrypto = (crypto) => ({
    type: SET_ONE_CRYPTO,
    crypto,
  });

const removeCryptoId = () => ({
  type: REMOVE_CRYPTO
});
















export const fetchCryptos = () => async (dispatch) => {
    const response = await fetch("/api/cryptos/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setCrypto(data));
    }
};





export const fetchOneCrypto = (cryptoId) => async (dispatch) => {
    const response = await fetch(`/api/cryptos/${cryptoId}`);
    console.log(response)
    if (response.ok) {

      const crypto = await response.json();
      dispatch(setOneCrypto(crypto));

    }
  };





export const deleteCrypto = (cryptoId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/cryptos/${cryptoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete stock");  // Prevents misleading success alerts
      }

      dispatch(removeCryptoId(cryptoId)); // Update Redux state
      return "crypto deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { crypto: null };



function cryptoReducer(state = initialState, action) {
  switch (action.type) {



    case SET_CRYPTO:
        return { ...state, crypto: action.payload };
    case SET_ONE_CRYPTO:
        return { crypto: action.crypto};
    case REMOVE_CRYPTO:{
        const newState = { ...state };
        delete newState.cryptos[action.cryptoId];
        return newState;
      }
    default:
        return state;
  }
}



export default cryptoReducer;
