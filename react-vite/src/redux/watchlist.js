

import { csrfFetch } from "./csrf";


const SET_WATCHLIST = 'session/watchlists';
const SET_ONE_WATCHLIST = '/api/watchlists/:watchlistId';
const REMOVE_WATCHLIST = 'session/watchlists';













const setWatchlist = (user) => ({
  type: SET_WATCHLIST,
  payload: user
});


const setOneWatchlist = (watchlist) => ({
    type: SET_ONE_WATCHLIST,
    watchlist,
  });

const removeWatchlistId = () => ({
  type: REMOVE_WATCHLIST
});
















export const fetchWatchlists = () => async (dispatch) => {
    const response = await fetch("/api/watchlists/");
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setWatchlist(data));
    }
};





export const fetchOneWatchlist = (watchlistId) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}`);
    console.log(response)
    if (response.ok) {

      const watchlist = await response.json();
      dispatch(setOneWatchlist(watchlist));

    }
  };





export const deleteWatchlist = (watchlistId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/watchlists/${watchlistId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete watchlist");  // Prevents misleading success alerts
      }

      dispatch(removeWatchlistId(watchlistId)); // Update Redux state
      return "Watchlist deleted successfully"; // Ensure frontend knows it worked
    } catch (error) {
      console.error("Delete Error:", error); // Log error to console
      throw error; // Ensures the frontend properly handles the failure
    }
  };
























const initialState = { watchlist: null };



function watchlistReducer(state = initialState, action) {
  switch (action.type) {



    case SET_WATCHLIST:
        return { ...state, watchlist: action.payload };
    case SET_ONE_WATCHLIST:
        return { watchlist: action.watchlist};
    case REMOVE_WATCHLIST:{
        const newState = { ...state };
        delete newState.watchlists[action.watchlistId];
        return newState;
      }
    default:
        return state;
  }
}



export default watchlistReducer;
