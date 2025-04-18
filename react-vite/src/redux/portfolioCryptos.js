

import { csrfFetch } from "./csrf";


const SET_PORTFOLIO_CRYPTO = 'session/portfolio_cryptos';
const SET_ONE_PORTFOLIO_CRYPTO = '/api/portfolio_cryptos/:portfolioCryptoId';
const REMOVE_PORTFOLIO_CRYPTO = 'session/portfolio_cryptos';













const setPortfolioCrypto = (user) => ({
  type: SET_PORTFOLIO_CRYPTO,
  payload: user
});


const setOnePortfolioCrypto = (portfolio) => ({
    type: SET_ONE_PORTFOLIO_CRYPTO,
    portfolio,
  });

const removePortfolioCryptoId = () => ({
  type: REMOVE_PORTFOLIO_CRYPTO
});
















export const fetchPortfolioCryptos = () => async (dispatch) => {
    const response = await fetch("/api/portfolio_cryptos/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setPortfolioCrypto(data));
    }
};





export const fetchOnePortfolioCrypto = (portfolioCryptoId) => async (dispatch) => {
    const response = await fetch(`/api/portfolio_cryptos/${portfolioCryptoId}`);
    console.log(response)
    if (response.ok) {

      const portfolio_crypto = await response.json();
      dispatch(setOnePortfolioCrypto(portfolio_crypto));

    }
  };





export const deletePortfolioCrypto = (portfolioCryptoId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/portfolio_cryptos/${portfolioCryptoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio crypto");  // Prevents misleading success alerts
      }

      dispatch(removePortfolioCryptoId(portfolioCryptoId)); // Update Redux state
      return "Portfolio Crypto deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { portfolio_crypto: null };



function portfolioCryptoReducer(state = initialState, action) {
  switch (action.type) {



    case SET_PORTFOLIO_CRYPTO:
        return { ...state, portfolio_crypto: action.payload };
    case SET_ONE_PORTFOLIO_CRYPTO:
        return { portfolio_crypto: action.portfolio_crypto};
    case REMOVE_PORTFOLIO_CRYPTO:{
        const newState = { ...state };
        delete newState.portfolio_crypto[action.portfolioCryptoId];
        return newState;
      }
    default:
        return state;
  }
}



export default portfolioCryptoReducer;
