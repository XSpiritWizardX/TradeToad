import { csrfFetch } from "./csrf";

const CREATE_PORTFOLIO = 'session/createPortfolio';
// const SET_PORTFOLIO = 'session/portfolios';
// const SET_ONE_PORTFOLIO = '/api/portfolios/:portfolioId';
const SET_ONE_PORTFOLIO = 'session/onePortfolio';
// const REMOVE_PORTFOLIO = 'session/portfolios';
const REMOVE_PORTFOLIO = 'session/removePortfolio';
const GET_PORTFOLIOS = 'session/getPortfolios';


// const setPortfolio = (user) => ({
//   type: SET_PORTFOLIO,
//   payload: user
// });

const addPortfolio = (portfolio) => ({
  type: CREATE_PORTFOLIO,
  payload: portfolio
});

const setOnePortfolio = (portfolio) => ({
    type: SET_ONE_PORTFOLIO,
    payload: portfolio,
  });

const removePortfolioId = (portfolioId) => ({
  type: REMOVE_PORTFOLIO,
  portfolioId
});

const getPortfolios = (portfolios) => ({
  type: GET_PORTFOLIOS,
  payload: portfolios
});


// Thunk action creators
export const fetchPortfolios = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/portfolios/', {
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(getPortfolios(data));
      return data;
    }
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
};


export const fetchOnePortfolio = (portfolioId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/portfolios/${portfolioId}`, {
      credentials: 'include'
    });
    console.log('fetchOnePortfolio response:', response)

    if (response.ok) {
      const portfolio = await response.json();
      dispatch(setOnePortfolio(portfolio));
      return portfolio;
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};


export const createPortfolio = (portfolioData) => async (dispatch) => {
  // const {user_id, total_cash, available_cash} = portfolioData
  try {
    const response = await csrfFetch('/api/portfolios/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portfolioData),
      credentials: 'include'   // send auth. cookies in request
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addPortfolio(data));
      return data;
    }
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
};


export const deletePortfolio = (portfolioId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete portfolio');  // Prevents misleading success alerts
      }

      dispatch(removePortfolioId(portfolioId)); // Update Redux state
      return 'Portfolio deleted successfully'; // Ensure frontend knows it worked
    } catch (error) {
      console.error('Delete Error:', error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };


const initialState = { portfolio: null };


// Reducer
function portfolioReducer(state = initialState, action) {
  switch (action.type) {

    case CREATE_PORTFOLIO:
        return { ...state, portfolio: action.payload };

    case SET_ONE_PORTFOLIO:
        return { ...state, portfolio: action.payload };

    // updated to handle deletion of single portfolio or entry in port array:
    case REMOVE_PORTFOLIO: {
      const newState = { ...state };
      if (newState.portfolio && newState.portfolio.portfolios) {
        // if we have a portfolios array, filter out the deleted one
        newState.portfolio.portfolios = newState.portfolio.portfolios.filter(
          portfolio => portfolio.id !== action.portfolioId
        );
      } else {
        // if we're dealing with a single portfolio and it matches the ID, set to null
        if (newState.portfolio && newState.portfolio.id === action.portfolioId) {
          newState.portfolio = null;
        }
      }
      return newState;
    }

    case GET_PORTFOLIOS:
      return { ...state, portfolio: action.payload };

    // case REMOVE_PORTFOLIO:{
    //     const newState = { ...state };
    //     delete newState.portfolios[action.portfolioId];
    //     return newState;
    //   }

    default:
        return state;
  }
}



export default portfolioReducer;
