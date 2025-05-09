import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import portfolioReducer from "./portfolio";
import watchlistReducer from "./watchlist";
import portfolioStockReducer from "./portfolioStocks";
import watchlistStockReducer from "./watchlistStocks";
import stockReducer from "./stocks";
import cryptoReducer from "./cryptos";
import watchlistCryptoReducer from "./watchlistCryptos";
import portfolioCryptoReducer from "./portfolioCryptos";
import cryptoTransactionReducer from "./cryptoTransactions";
import stockTransactionReducer from "./stockTransactions";
import stockDataReducer from "./stockPrices";


const rootReducer = combineReducers({
  session: sessionReducer,
  stock: stockReducer,
  watchlist: watchlistReducer,
  portfolio: portfolioReducer,
  portfolioStock: portfolioStockReducer,
  watchlistStock: watchlistStockReducer,
  crypto: cryptoReducer,
  watchlistCrypto: watchlistCryptoReducer,
  portfolioCrypto: portfolioCryptoReducer,
  cryptoTransaction: cryptoTransactionReducer,
  stockTransaction: stockTransactionReducer,
  stockData: stockDataReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};


export default configureStore;
