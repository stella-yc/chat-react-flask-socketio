import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, applyMiddleware(logger));

export default store;

export * from './reducer';
