/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import axios from 'axios';
import { getOneCardFromServer } from '../store/NextCard';
import { connect } from 'react-redux'

class Dealer extends React.Component {
  constructor() {
    super()
    this.state = {
      dealerCards: [],
      dealerValue: 0,
      dealerHiddenCard: {},
      playerCards: [],
      playerValue: 0,
      deck: '',
      result: '',
      playerStand: false
    }
    this.onStartHand = this.onStartHand.bind(this)
    this.onNewDeck = this.onNewDeck.bind(this)
    this.onPlayerHit = this.onPlayerHit.bind(this)
    this.onPlayerStand = this.onPlayerStand.bind(this)
    this.onDoubleDown = this.onDoubleDown.bind(this)
    this.onCheckHands = this.onCheckHands.bind(this)
    this.onFlipDealerCard = this.onFlipDealerCard.bind(this)
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
      dealerCards: [ cards.cards[3] ],
      dealerValue: this.getCardValue(cards.cards[3].value),
      dealerHiddenCard: cards.cards[1],
      playerCards: [ cards.cards[0], cards.cards[2] ],
      playerValue: this.getCardValue(cards.cards[0].value) + this.getCardValue(cards.cards[2].value),
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
        dealerHiddenCard: {},
        playerCards: [],
        playerValue: 0,
        deck: deck.deck_id,
        result: '',
        playerStand: false
      }))
  }

  onStartHand() {
    const { dealerCards, playerCards, deck } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=4`)
      .then(res => res.data)
      .then(cards => {
        this.setState({ playerStand: false })
        this.OnDealHand(cards)
      })
      .then(() => {
        const { playerValue, dealerValue, dealerHiddenCard } = this.state
        const realDealerValue = dealerValue + this.getCardValue(dealerHiddenCard.value)
        console.log('dealer cards: ', realDealerValue)
        console.log('player cards: ', playerValue)
        if (playerValue === 21) {
          return setTimeout(() => {
            this.onFlipDealerCard()
            this.setState({ result: `You win with Stackjack!` })
          }, 1000)
        }
        else if (realDealerValue === 21) {
          return setTimeout(() => {
            this.onFlipDealerCard()
            this.setState({ result: `Dealer has Blackjack` })
          }, 1000)
        }
        else if (playerValue === 21 && realDealerValue === 21 ) {
          return setTimeout(() => {
            this.onFlipDealerCard()
            this.setState({ result: `Push - play again!` })
          }, 1000)
        }
      })
  }

  onPlayerHit() {
    const { playerCards, playerValue, deck, result } = this.state
    axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
      .then(res => res.data)
      .then(card => {
        this.setState({
          playerCards: playerCards.concat(card.cards),
          playerValue: playerValue + this.getCardValue(card.cards[0].value),
        })
      })
      .then(() => this.setState({ result: this.state.playerValue > 21 ? 'You busted! Dealer wins.' : '' }))
  }

  onDoubleDown() {
    this.onPlayerHit()
    setTimeout(() => this.onPlayerStand(), 1000)
  }

  onFlipDealerCard() {
    const { dealerValue, dealerCards, dealerHiddenCard, playerValue, result, deck } = this.state
    this.setState({
      dealerCards: [ dealerHiddenCard, ...dealerCards ],
      dealerValue: dealerValue + this.getCardValue(dealerHiddenCard.value),
      playerStand: true
    })
  }

  onPlayerStand() {
    this.onFlipDealerCard()
    setTimeout(() => this.onCheckHands(), 1000)
  }

  onCheckHands() {
    const { dealerValue, dealerCards, playerValue, result, deck } = this.state
    if (dealerValue <= 16) {
      axios.get(`https://deckofcardsapi.com/api/deck/${deck}/draw/?count=1`)
        .then(res => res.data)
        .then(card => {
          this.setState({
            dealerCards: [ ...this.state.dealerCards, card.cards[0]],
            dealerValue: this.state.dealerValue + this.getCardValue(card.cards[0].value),
          })
        })
        .then(() => setTimeout(() => this.onCheckHands(), 1000))
    }
    else if (dealerValue > 21) {
      return setTimeout(() => this.setState({ result: `You win! Dealer busts!` }), 1000)
    }
    else {
      if (dealerValue > playerValue) {
        return setTimeout(() => this.setState({ result: `Dealer wins with a ${dealerValue}` }), 1000)
      }
      else if (playerValue > dealerValue) {
        return setTimeout(() => this.setState({ result: `You win with a ${playerValue}!` }), 1000)
      }
      else {
        return setTimeout(() => this.setState({ result: 'Push - play again!' }), 1000)
      }
    }
  }

  render() {
    const { onStartHand, onNewDeck, onPlayerHit, onPlayerStand, onDoubleDown } = this
    const { dealerCards, dealerValue, dealerHiddenCard, playerCards, playerValue, result, playerStand } = this.state
    /* BUTTON DISABLING */
    const noStartHand = playerCards.length > 1
    const noNewDeck = !dealerCards.length || !playerCards.length
    const noPlayerCards = !playerCards.length
    const playerBust = playerValue > 21
    return (
      <View style={ styles.container }>

        { result && <Text style={styles.playerBust}>{ result }</Text> }

        <Text style={ styles.headline1 }>Dealer's Cards</Text>
        <Text style={ styles.headline2 }>Total: {dealerValue}</Text>
        <View style={ styles.inline }>
          {!playerStand && dealerHiddenCard.image &&
          <View>
            <Text></Text>
            <Image
              style={styles.image}
              source={require('./../card-back.jpg')}
            />
          </View>
        }
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
          <Button disabled={ noStartHand } onPress={ onStartHand } title="Start hand" />
          <Button disabled={ noNewDeck } onPress={ onStartHand } title={ result ? ('Play again') : ('New hand') } />
          <Button disabled={ noNewDeck } onPress={ onNewDeck } title="New deck" />
        </View>

        <Text style={ styles.headline1 }>Player's Cards</Text>
        <Text style={ styles.headline2 }>Total: {playerValue}</Text>
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
          <Button onPress={ onPlayerStand } disabled={ noPlayerCards || playerBust || !!result }
          title="Stand" />
          <Button onPress={ onDoubleDown } disabled={ noPlayerCards || playerBust || !!result }
        title="Double Down" />
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
  headline1: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  headline2: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 10
  },
  playerBust: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'red',
    paddingBottom: 10,
    textAlign: 'center'
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


const mapState = ({ nextCard }) => {
  return { nextCard }
}

const mapDispatch = (dispatch) => {
  return {
    getNextCard: () => dispatch(getOneCardFromServer())
  }
}

export default connect(mapState, mapDispatch)(Dealer);
