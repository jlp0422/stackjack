import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import nextCardReducer from './NextCard';

const reducer = combineReducers({
  nextCard: nextCardReducer
})

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
