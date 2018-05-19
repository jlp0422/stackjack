export const ADD_PLAYER_CARD = 'ADD_PLAYER_CARD';
export const ADD_DEALER_CARD = 'ADD_DEALER_CARD'
export const GET_NEW_DECK = 'GET_NEW_DECK';
export const GET_NEW_HAND = 'GET_NEW_HAND';
export const FLIP_DEALER_CARD = 'FLIP_DEALER_CARD';
export const PLAYER_WIN = 'PLAYER_WIN';
export const PLAYER_LOSE = 'PLAYER_LOSE';

export const getCardValue = (value) => {
  // right now, only counts ACE as 11
  if (value * 1) return value * 1
  else if (value === 'ACE') return 11
  else return 10
}
