import { csrfFetch } from "./csrf";

const SET_PORTFOLIO_SUMMARY = "portfolioSummary/set";

const setPortfolioSummary = (summary) => ({
  type: SET_PORTFOLIO_SUMMARY,
  payload: summary,
});

export const fetchPortfolioSummary = () => async (dispatch) => {
  const response = await csrfFetch("/api/portfolios/summary", {
    credentials: "include",
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(setPortfolioSummary(data.portfolio));
    return data.portfolio;
  }
  return null;
};

const initialState = { portfolio: null };

function portfolioSummaryReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PORTFOLIO_SUMMARY:
      return { ...state, portfolio: action.payload };
    default:
      return state;
  }
}

export default portfolioSummaryReducer;
