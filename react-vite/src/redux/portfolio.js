

import { csrfFetch } from "./csrf";


const SET_PORTFOLIO = 'session/portfolios';
const SET_ONE_PORTFOLIO = '/api/portfolios/:portfolioId';
const REMOVE_PORTFOLIO = 'session/portfolios';













const setPortfolio = (user) => ({
  type: SET_PORTFOLIO,
  payload: user
});


const setOnePortfolio = (portfolio) => ({
    type: SET_ONE_PORTFOLIO,
    portfolio,
  });

const removePortfolioId = () => ({
  type: REMOVE_PORTFOLIO
});
















export const fetchPortfolios = () => async (dispatch) => {
	const response = await fetch("/api/portfolios/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setPortfolio(data));
	}
};





export const fetchOnePortfolio = (portfolioId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${portfolioId}`);
    console.log(response)
    if (response.ok) {

      const portfolio = await response.json();
      dispatch(setOnePortfolio(portfolio));

    }
  };

export const createPortfolio = (portfolio) => async (dispatch) => {
  const {user_id, total_cash, available_cash} = portfolio
  const response = await csrfFetch("/api/portfolios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      total_cash,
      available_cash
    })
  })
  const data = await response.json();
  dispatch(createPortfolio(data));
}



export const deletePortfolio = (portfolioId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/portfolios/${portfolioId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio");  // Prevents misleading success alerts
      }

      dispatch(removePortfolioId(portfolioId)); // Update Redux state
      return "Portfolio deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { portfolio: null };



function portfolioReducer(state = initialState, action) {
  switch (action.type) {



    case SET_PORTFOLIO:
        return { ...state, portfolio: action.payload };
    case SET_ONE_PORTFOLIO:
        return { portfolio: action.portfolio};
    case REMOVE_PORTFOLIO:{
        const newState = { ...state };
        delete newState.portfolios[action.portfolioId];
        return newState;
      }
    default:
        return state;
  }
}



export default portfolioReducer;
