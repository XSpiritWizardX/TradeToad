import { csrfFetch } from "./csrf";

const CREATE_WATCHLIST = 'session/createWatchlist';
// const SET_ONE_WATCHLIST = 'session/oneWatchlist';
const REMOVE_WATCHLIST = 'session/removeWatchlist';
const GET_WATCHLISTS = 'session/getWatchlists';
const UPDATE_WATCHLIST = 'session/updateWatchlist';


// action creators
const addWatchlist = (watchlist) => ({
  type: CREATE_WATCHLIST,
  payload: watchlist
});

// const setOneWatchlist = (watchlist) => ({
//   type: SET_ONE_WATCHLIST,
//   payload: watchlist,
// });

const removeWatchlistId = (watchlistId) => ({
  type: REMOVE_WATCHLIST,
  payload: watchlistId
});

const getWatchlists = (watchlists) => ({
  type: GET_WATCHLISTS,
  payload: watchlists
});

const updateWatchlistAction = (watchlist) => ({
  type: UPDATE_WATCHLIST,
  payload: watchlist
});

// Thunk action creators
export const fetchWatchlists = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/watchlists/', {
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(getWatchlists(data));
      return data;
    }
  } catch (error) {
    console.error('Error fetching watchlists:', error);
    throw error;
  }
};


export const createWatchlist = (watchlistData) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/watchlists/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchlistData),
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addWatchlist(data));
      // after creating a watchlist, fetch all watchlists to update the state
      dispatch(fetchWatchlists());
      return data;
    } else {
      // handle non-OK responses
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create watchlist');
    }
  } catch (error) {
    console.error('Error creating watchlist:', error);
    throw error;
  }
};

export const deleteWatchlist = (watchlistId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/watchlists/${watchlistId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete watchlist');
    }

    dispatch(removeWatchlistId(watchlistId));
    return 'Watchlist deleted successfully';
  } catch (error) {
    console.error('Delete Error:', error);
    throw error;
  }
};

export const updateWatchlist = (watchlistId, watchlistData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/watchlists/${watchlistId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(watchlistData),
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(updateWatchlistAction(data));
      // after updating, fetch all watchlists to update the state
      dispatch(fetchWatchlists());
      return data;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update watchlist');
    }
  } catch (error) {
    console.error('Error updating watchlist:', error);
    throw error;
  }
};

const initialState = { watchlist: null };

// Reducer
function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_WATCHLIST:
      return { ...state, watchlist: action.payload };

    // case SET_ONE_WATCHLIST:
    //   return { ...state, watchlist: action.payload };

    case REMOVE_WATCHLIST: {
      const newState = { ...state };
      if (newState.watchlist && newState.watchlist.watchlists) {
        // if we have a watchlists array, filter out the deleted one
        newState.watchlist.watchlists = newState.watchlist.watchlists.filter(
          watchlist => watchlist.id !== action.watchlistId
        );
      } else {
        // if were dealing with a single watchlist and it matches the ID, set to null
        if (newState.watchlist && newState.watchlist.id === action.watchlistId) {
          newState.watchlist = null;
        }
      }
      return newState;
    }

    case GET_WATCHLISTS:
      return { ...state, watchlist: action.payload };

    case UPDATE_WATCHLIST:
      return { ...state, watchlist: action.payload };

    default:
      return state;
  }
}


export default watchlistReducer;
