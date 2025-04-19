import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import * as portfolioActions from "./redux/portfolio"
import "./index.css";
import { restoreCSRF, csrfFetch } from './redux/csrf';


const store = configureStore();

// only in development --
if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
  window.portfolioActions = portfolioActions;

  restoreCSRF().then(() => {
    // now that CSRF protection is set up, render the app
    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <ReduxProvider store={store}>
          <RouterProvider router={router} />
        </ReduxProvider>
      </React.StrictMode>
    );
  });
} else {
  // in production, just render without the CSRF setup --
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </React.StrictMode>
  );

}


