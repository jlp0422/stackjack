/* eslint-disable */
import axios from 'axios';

import {
  ADD_PLAYER_CARD,
  ADD_DEALER_CARD,
  GET_NEW_DECK,
  GET_NEW_HAND,
  CHECK_HANDS,
  FLIP_DEALER_CARD,
  PLAYER_WIN,
  PLAYER_LOSE,
  MAKE_PLAYER_ACE_ONE,
  MAKE_DEALER_ACE_ONE,
  ADD_FUNDS,
  getCardValue } from './actionConstants';

const addPlayerCard = (card) => ({type: ADD_PLAYER_CARD, card })
const addDealerCard = (card) => ({type: ADD_DEALER_CARD, card })
const getNewDeck = () => ({ type: GET_NEW_DECK })
const getNewHand = (cards) => ({ type: GET_NEW_HAND, cards })
const flipDealerCard = () => ({ type: FLIP_DEALER_CARD })
const winningHand = (stake) => ({ type: PLAYER_WIN, stake })
const losingHand = (stake) => ({ type: PLAYER_LOSE, stake})
const makePlayerAceOne = () => ({ type: MAKE_PLAYER_ACE_ONE })
const makeDealerAceOne = () => ({ type: MAKE_DEALER_ACE_ONE })
const addFunds = (amount) => ({ type: ADD_FUNDS, amount })

export const newDeck = () => {
  return (dispatch) => {
    return axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(res => res.data)
    .then(deck => dispatch(getNewDeck(deck)))
  }
}

export const newHand = (deck) => {
  return (dispatch) => {
    return axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
    .then( res => res.data)
    .then( cards => dispatch(getNewHand(cards)))
  }
}

export const dealOneCard = (deck, player) => {
  const method = player === 'player' ? addPlayerCard : addDealerCard
  return (dispatch) => {
    return axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
    .then( res => res.data)
    .then( card => dispatch(method(card.cards[0])))
  }
}

export const flipCard = () => flipDealerCard()
export const addFundsToAccount = (amount) => addFunds(amount)
export const playerWin = (stake) => winningHand(stake)
export const playerLose = (stake) => losingHand(stake)
export const makeAceOne = (player) => {
  const method = player === 'player' ? makePlayerAceOne : makeDealerAceOne
  return method()
}

const initialState = {
  dealerCards: [],
  dealerValue: 0,
  dealerHiddenCard: {},
  playerCards: [],
  playerValue: 0,
  playerStand: false,
  playerBankroll: 25
}

const handReducer = (state = initialState, action) => {
  console.log('REDUCER ACTION: ', action.type)
  console.log('FUNDS AMOUNT: ', action.amount)
  switch(action.type) {

    case ADD_PLAYER_CARD:
      return Object.assign({}, state, {
        playerCards: [ ...state.playerCards, action.card ],
        playerValue: state.playerValue + getCardValue(action.card.value)
      })

    case ADD_DEALER_CARD:
      return Object.assign({}, state, {
        dealerCards: [ ...state.dealerCards, action.card ],
        dealerValue: state.dealerValue + getCardValue(action.card.value)
      })

    case FLIP_DEALER_CARD:
      return Object.assign({}, state, {
        dealerCards: [ state.dealerHiddenCard, ...state.dealerCards ],
        dealerValue: state.dealerValue + getCardValue(state.dealerHiddenCard.value),
        playerStand: true
      })

    case GET_NEW_DECK:
      return Object.assign({}, state, {
        dealerCards: [],
        dealerValue: 0,
        dealerHiddenCard: {},
        playerCards: [],
        playerValue: 0,
        playerStand: false,
      })

    case GET_NEW_HAND:
      return Object.assign({}, state, {
        dealerCards: [ action.cards.cards[3] ],
        dealerValue: getCardValue(action.cards.cards[3].value),
        dealerHiddenCard: action.cards.cards[1],
        playerCards: [ action.cards.cards[0], action.cards.cards[2] ],
        playerValue: getCardValue(action.cards.cards[0].value) + getCardValue(action.cards.cards[2].value),
        playerStand: false
      })

    case PLAYER_WIN:
      return Object.assign({}, state, { playerBankroll: state.playerBankroll + action.stake })

    case PLAYER_LOSE:
      return Object.assign({}, state, { playerBankroll: state.playerBankroll - action.stake })

    case MAKE_PLAYER_ACE_ONE:
      return Object.assign({}, state, { playerValue: state.playerValue - 10 })

    case ADD_FUNDS:
      return Object.assign({}, state, { playerBankroll: state.playerBankroll + action.amount })
  }
  return state
}

export default handReducer
