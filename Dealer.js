/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import axios from 'axios'

class Dealer extends React.Component {
  constructor() {
    super()
    this.state = {
      dealerCards: [],
      dealerValue: 0,
      playerCards: [],
      playerValue: 0,
      deck: ''
    }
    this.onStartHand = this.onStartHand.bind(this)
    this.onNewDeck = this.onNewDeck.bind(this)
  }

  componentDidMount() {
    this.onNewDeck()
  }

  onNewDeck() {
    const { deck } = this.state
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
      .then(res => res.data)
      .then(deck => this.setState({
        dealerCards: [],
        dealerValue: 0,
        playerCards: [],
        playerValue: 0,
        deck: deck.deck_id })
      )
  }

  onDealOneCard(person) {
    const { dealerCards, playerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=2`)
      .then(res => res.data)
      .then(card => {
        if (person === 'dealer') this.setState({ dealerCards: dealerCards.concat(card.cards) })
        if (person === 'player') this.setState({ playerCards: playerCards.concat(card.cards) })
      })
  }

  onStartHand() {
    const { dealerCards, playerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
      .then(res => res.data)
      .then(cards => {
        this.setState({
          dealerCards: [ cards.cards[0], cards.cards[2] ],
          playerCards: [cards.cards[1], cards.cards[3]]
        })
      })
  }

  render() {
    // console.log('cards: ', this.state.dealerCards)
    const { onStartHand, onNewDeck } = this
    const { dealerCards, playerCards } = this.state
    const noNewHand = dealerCards.length > 1 && playerCards.length > 1
    return (
      <View style={ styles.container }>
        <Text>Dealer's Cards</Text>
        { dealerCards.length &&
          dealerCards.map(card => (
            <View key={card.code}>
              <Text>{`${card.value} of ${card.suit}`}</Text>
             {/*<Image source='http://deckofcardsapi.com/static/img/5C.png' /> */}
            </View>
          ))
        }
        <Button disabled={ noNewHand } onPress={onStartHand} title="Start Hand" />
        <Button onPress={onNewDeck} title="New Deck" />
        <Text>Player's Cards</Text>
        {playerCards.length &&
          playerCards.map(card => (
            <View key={card.code}>
              <Text>{`${card.value} of ${card.suit}`}</Text>
              {/*<Image source='http://deckofcardsapi.com/static/img/5C.png' /> */}
            </View>
          ))
        }

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {

  },
  image: {

  }
})

export default Dealer;
