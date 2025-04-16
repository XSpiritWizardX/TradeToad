const SET_PORTFOLIO = 'session/setUser';
const REMOVE_PORTFOLIO = 'session/removeUser';













const setPortfolio = (user) => ({
  type: SET_USER,
  payload: user
});

const removePORTFOLIO = () => ({
  type: REMOVE_USER
});
















export const thunkAuthenticate = () => async (dispatch) => {
  console.log('trying to get csrf')
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};




export const thunkLogin = (credentials) => async dispatch => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};








export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};






export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};









const initialState = { user: null };



function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PORTFOLIO:
      return { ...state, portfolio: action.payload };
    case REMOVE_PORTFOLIO:
      return { ...state, portfolio: null };
    default:
      return state;
  }
}



export default sessionReducer;
