import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import * as portfolioActions from "./redux/portfolio"
import "./index.css";
import { restoreCSRF } from './redux/csrf';

const store = configureStore();

// only in development --
if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
  window.portfolioActions = portfolioActions;
}

// first restore CSRF, then check authentication, then render
restoreCSRF().then(() => {
  // try to authenticate the user
  store.dispatch(sessionActions.thunkAuthenticate()).finally(() => {
    // render the app regardless of authentication result
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <ReduxProvider store={store}>
          <RouterProvider router={router} />
        </ReduxProvider>
      </React.StrictMode>
    );
  });
});

