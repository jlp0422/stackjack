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
      deck: '',
      result: ''
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
    // right now, counts ACE as 11
    if (value * 1) return value * 1
    else if (value === 'ACE') return 11
    else return 10
  }

  OnDealHand(cards) {
    this.setState({
      dealerCards: [cards.cards[0], cards.cards[2]],
      dealerValue: this.getCardValue(cards.cards[0].value) + this.getCardValue(cards.cards[2].value),
      playerCards: [cards.cards[1], cards.cards[3]],
      playerValue: this.getCardValue(cards.cards[1].value) + this.getCardValue(cards.cards[3].value),
      result: ''
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
        deck: deck.deck_id,
        result: ''
      }))
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

  onPlayerHit() {
    const { playerCards, playerValue, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
      .then(res => res.data)
      .then(card => {
        this.setState({
          playerCards: playerCards.concat(card.cards),
          playerValue: playerValue + this.getCardValue(card.cards[0].value)
        })
      })
  }

  onPlayerStand() {
    const { dealerValue, dealerCards, playerValue, result, deck } = this.state
    console.log('dealder: ', dealerValue)
    console.log('player', playerValue)
    if (dealerValue < 16) {
      axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
        .then(res => res.data)
        .then(card => {
          this.setState({
            dealerCards: dealerCards.concat(card.cards),
            dealerValue: dealerValue + this.getCardValue(card.cards[0].value)
          })
        })
        .then(() => setTimeout(() => this.onPlayerStand(), 1000))
    }
    else if (dealerValue > 21) {
      return this.setState({ result: `You win! Dealer busted!` })
    }
    else {
      if (dealerValue > playerValue) {
        return this.setState({ result: `Dealer wins with a ${dealerValue}` })
      }
      else if (playerValue > dealerValue) {
        return this.setState({ result: `You win with a ${playerValue}!` })
      }
      else {
        return this.setState({ result: 'Push - play again!' })
      }
    }
  }

  render() {
    const { onStartHand, onNewDeck, onNewHand, onPlayerHit, onPlayerStand } = this
    const { dealerCards, dealerValue, playerCards, playerValue, result } = this.state
    /* BUTTON DISABLING */
    const noStartHand = dealerCards.length > 1 && playerCards.length > 1
    const noNewDeck = !dealerCards.length || !playerCards.length
    const noPlayerCards = !playerCards.length
    const playerBust = playerValue > 21
    return (
      <View style={ styles.container }>

        { playerBust && <Text style={ styles.playerBust }>You busted! Dealer wins</Text> }

        { result && <Text style={styles.playerBust}>{ result }</Text> }

        <Text style={ styles.headline }>Dealer's Cards</Text>
        <Text style={ styles.headline }>Total: {dealerValue}</Text>
        <View style={ styles.inline }>
        { dealerCards.length &&
          dealerCards.map(card => (
            <View key={card.code}>
              <Text>{`${card.value} OF ${card.suit}`}</Text>
              <Image
                style={ styles.image }
                source={{ uri: `${card.image}` }}
              />
            </View>
          ))
        }
        </View>
        <View style={ styles.inline }>
          <Button disabled={ noStartHand } onPress={ onStartHand } title="Start Hand" />
          <Button onPress={ onNewHand } title="New Hand" />
          <Button disabled={ noNewDeck } onPress={onNewDeck} title="New Deck" />
        </View>

        <Text style={ styles.headline }>Player's Cards</Text>
        <Text style={styles.headline}>Total: {playerValue}</Text>
        <View style={ styles.inline }>
          {playerCards.length &&
            playerCards.map(card => (
              <View style={{ alignSelf: 'center' }} key={card.code}>
                <Text>{`${card.value} OF ${card.suit}`}</Text>
                <Image
                  style={ styles.image }
                  source={{ uri: `${card.image}` }}
                />
              </View>
            ))
          }
        </View>

        <View style={ styles.inline }>
          <Button onPress={ onPlayerHit } disabled={ noPlayerCards || playerBust || !!result } title="Hit" />
          <Button onPress={ onPlayerStand } disabled={ noPlayerCards || playerBust || !!result } title="Stand" />
        </View>
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
  playerBust: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    paddingBottom: 10
  },
  inline: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 15
  },
  image: {
    width: 50,
    height: 70,
    alignSelf: 'center'
  }
})

export default Dealer;
