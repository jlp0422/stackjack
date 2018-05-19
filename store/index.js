import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import handReducer from './HandReducer';

const reducer = combineReducers({
  hand: handReducer
})

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
