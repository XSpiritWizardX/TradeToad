

import { csrfFetch } from "./csrf";


const SET_WATCHLIST_CRYPTO = 'session/watchlist_cryptos';
const SET_ONE_WATCHLIST_CRYPTO = '/api/watchlist_cryptos/:watchlistCryptoId';
const REMOVE_WATCHLIST_CRYPTO = 'session/watchlist_cryptos';













const setWatchlistCrypto = (user) => ({
  type: SET_WATCHLIST_CRYPTO,
  payload: user
});


const setOneWatchlistCrypto = (watchlist) => ({
    type: SET_ONE_WATCHLIST_CRYPTO,
    watchlist,
  });

const removeWatchlistCryptoId = () => ({
  type: REMOVE_WATCHLIST_CRYPTO
});
















export const fetchWatchlistCryptos = () => async (dispatch) => {
    const response = await fetch("/api/watchlist_cryptos/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setWatchlistCrypto(data));
    }
};





export const fetchOneWatchlistCrypto = (watchlistCryptoId) => async (dispatch) => {
    const response = await fetch(`/api/watchlist_cryptos/${watchlistCryptoId}`);
    console.log(response)
    if (response.ok) {

      const watchlist_crypto = await response.json();
      dispatch(setOneWatchlistCrypto(watchlist_crypto));

    }
  };





export const deleteWatchlistCrypto = (watchlistCryptoId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/watchlist_cryptos/${watchlistCryptoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete watchlist");  // Prevents misleading success alerts
      }

      dispatch(removeWatchlistCryptoId(watchlistCryptoId)); // Update Redux state
      return "watchlist crypto deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { watchlist_crypto: null };



function watchlistCryptoReducer(state = initialState, action) {
  switch (action.type) {



    case SET_WATCHLIST_CRYPTO:
        return { ...state, watchlist_crypto: action.payload };
    case SET_ONE_WATCHLIST_CRYPTO:
        return { watchlist_crypto: action.watchlist_crypto};
    case REMOVE_WATCHLIST_CRYPTO:{
        const newState = { ...state };
        delete newState.watchlist_crypto[action.watchlistCryptoId];
        return newState;
      }
    default:
        return state;
  }
}



export default watchlistCryptoReducer
