/* eslint-disable */
import axios from 'axios'

const GET_ONE_CARD = 'GET_ONE_CARD'

const getOneCard = (card) => ({ type: GET_ONE_CARD, card })

export const getOneCardFromServer = (deck) => {
  return (dispatch) => {
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
      .then(res => res.data)
      .then(card => dispatch(getOneCard(card.cards[0])))
  }
}

const nextCardReducer = (state = {}, action) => {
  switch(action.type) {
    case GET_ONE_CARD:
      state = card
  }
  return state
}

export default nextCardReducer;
