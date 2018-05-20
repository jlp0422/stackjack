/* eslint-disable */
export const ADD_PLAYER_CARD = 'ADD_PLAYER_CARD';
export const ADD_DEALER_CARD = 'ADD_DEALER_CARD'
export const GET_NEW_DECK = 'GET_NEW_DECK';
export const GET_NEW_HAND = 'GET_NEW_HAND';
export const FLIP_DEALER_CARD = 'FLIP_DEALER_CARD';
export const PLAYER_WIN = 'PLAYER_WIN';
export const PLAYER_LOSE = 'PLAYER_LOSE';
export const MAKE_PLAYER_ACE_ONE = 'MAKE_PLAYER_ACE_ONE';
export const MAKE_DEALER_ACE_ONE = 'MAKE_DEALER_ACE_ONE';
export const ADD_FUNDS = 'ADD_FUNDS';

export const getCardValue = (cardValue) => {
  if (cardValue * 1) return cardValue * 1
  else if (cardValue === 'ACE') return 11
  else return 10
}
