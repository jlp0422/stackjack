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
    this.onNewHand = this.onNewHand.bind(this)
    this.onPlayerHit = this.onPlayerHit.bind(this)
    this.onPlayerStand = this.onPlayerStand.bind(this)
  }

  componentDidMount() {
    this.onNewDeck()
  }

  getCardValue(value) {
    console.log(value * 1)
    // if (value) return card.value * 1
    // else return 10
    return 1
  }

  OnDealHand(cards) {
    this.setState({
      dealerCards: [cards.cards[0], cards.cards[2]],
      playerCards: [cards.cards[1], cards.cards[3]]
    })
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

  onPlayerHit() {
    const { playerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
      .then(res => res.data)
      .then(card => {
        this.setState({ playerCards: playerCards.concat(card.cards) })
      })
  }

  onPlayerStand() {
    const { dealerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
      .then(res => res.data)
      .then(card => {
        this.setState({ dealerCards: dealerCards.concat(card.cards) })
      })
  }

  onStartHand() {
    const { dealerCards, playerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
      .then(res => res.data)
      .then(cards => this.OnDealHand(cards))
  }

  onNewHand() {
    const { dealerCards, playerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
      .then(res => res.data)
      .then(cards => this.OnDealHand(cards))
  }

  render() {
    console.log('dealer value: ', this.state.dealerValue)
    console.log('player value: ', this.state.playerValue)
    const { onStartHand, onNewDeck, onNewHand, onPlayerHit, onPlayerStand } = this
    const { dealerCards, playerCards } = this.state
    /* BUTTON DISABLING */
    const noStartHand = dealerCards.length > 1 && playerCards.length > 1
    const noNewDeck = !dealerCards.length || !playerCards.length
    const noPlayerCards = !playerCards.length
    return (
      <View style={ styles.container }>
        <Text style={ styles.headline }>Dealer's Cards</Text>
        <View style={styles.cards}>
        { dealerCards.length &&
          dealerCards.map(card => (
            <View key={card.code}>
              <Text>{`${card.value} of ${card.suit}`}</Text>
              <Image
                style={{ width: 50, height: 70 }}
                source={{ uri: `${card.image}` }}
              />
            </View>
          ))
        }
        </View>

        <Button disabled={ noStartHand } onPress={ onStartHand } title="Start Hand" />
        <Button onPress={ onNewHand } title="New Hand, Same Deck" />
        <Button disabled={ noNewDeck } onPress={onNewDeck} title="New Deck" />

        <Text style={ styles.headline }>Player's Cards</Text>
        <View style={styles.cards}>
          {playerCards.length &&
            playerCards.map(card => (
              <View style={ styles.card } key={card.code}>
                <Text>{`${card.value} of ${card.suit}`}</Text>
                <Image
                  style={{ width: 50, height: 70 }}
                  source={{ uri: `${card.image}` }}
                />
              </View>
            ))
          }
        </View>

        <Button onPress={ onPlayerHit } disabled={ noPlayerCards } title="Hit" />
        <Button onPress={ onPlayerStand } disabled={ noPlayerCards } title="Stand" />

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20
  },
  headline: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  // cards: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   // justifyContent: 'center',
  //   alignItems: 'center'
  // },
  // card: {
  //   textAlign: 'center',
  //   flex: 1,
  //   flexDirection: 'row'
  // }
})

export default Dealer;
