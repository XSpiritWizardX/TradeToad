import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = () => async (dispatch) => {
  console.log('trying to get csrf');
  try {
    const response = await csrfFetch("/api/auth/");
    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
      return data;
    }
  } catch(error) {
    console.error("Authentication error:", error);
    return null;
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
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;



// frontend/src/store/session.js

// import { csrfFetch } from './csrf';




// const SET_USER = "session/setUser";
// const REMOVE_USER = "session/removeUser";





// const setUser = (user) => {
//   return {
//     type: SET_USER,
//     payload: user
//   };
// };




// const removeUser = () => {
//   return {
//     type: REMOVE_USER
//   };
// };









// export const restoreUser = () => async (dispatch) => {
//   const response = await csrfFetch("/api/session");
//   const data = await response.json();
//   console.log(data);
//   dispatch(setUser(data.user));
//     return response;
// };







// export const logout = () => async (dispatch) => {
//   const response = await csrfFetch('/api/session', {
//     method: 'DELETE'
//   });
//   dispatch(removeUser());
//   return response;
// };






// export const signup = (user) => async (dispatch) => {
//   const { username, firstName, lastName, email, password } = user;
//   const response = await csrfFetch("/api/users", {
//     method: "POST",
//     body: JSON.stringify({
//       username,
//       firstName,
//       lastName,
//       email,
//       password
//     })
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };







// export const login = (user) => async (dispatch) => {
//   const { credential, password } = user;
//   const response = await csrfFetch("/api/session", {
//     method: "POST",
//     body: JSON.stringify({
//       credential,
//       password
//     })
//   });
//   const data = await response.json();
//   dispatch(setUser(data.user));
//   return response;
// };




// const initialState = { user: null };





// const sessionReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case SET_USER:
//       return { ...state, user: action.payload };
//     case REMOVE_USER:
//       return { ...state, user: null };
//     default:
//       return state;
//   }
// };












// export default sessionReducer;
