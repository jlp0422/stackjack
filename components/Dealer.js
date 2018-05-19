/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { dealOneCard, newDeck, newHand, flipCard } from '../store/HandReducer';
import { getCardValue } from '../store/actionConstants';
const cardBack = require('../card-back.jpg')

class Dealer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: '',
      result: '',
    }
    this.onStartHand = this.onStartHand.bind(this)
    this.onNewDeck = this.onNewDeck.bind(this)
    this.onPlayerHit = this.onPlayerHit.bind(this)
    this.onPlayerStand = this.onPlayerStand.bind(this)
    this.onDoubleDown = this.onDoubleDown.bind(this)
    this.onCheckHands = this.onCheckHands.bind(this)
  }

  componentWillMount() {
    this.onNewDeck()
  }

  onNewDeck() {
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(res => res.data)
    .then(deck => this.setState({
      deck: deck.deck_id,
      result: '',
    }))
    .then(() => this.props.newDeck())
  }

  onStartHand() {
    const { deck } = this.state
    this.setState({ result: '' })
    this.props.newHand(deck)
      .then(() => {
        const { playerValue, dealerValue, dealerHiddenCard } = this.props.hand
        const realDealerValue = dealerValue + getCardValue(dealerHiddenCard.value)
        if (playerValue === 21) {
          return setTimeout(() => {
            this.props.flipCard()
            this.setState({ result: `You win with StackJack!` })
          }, 1000)
        }
        else if (realDealerValue === 21) {
          return setTimeout(() => {
            this.props.flipCard()
            this.setState({ result: `Dealer has StackJack` })
          }, 1000)
        }
        else if (playerValue === 21 && realDealerValue === 21 ) {
          return setTimeout(() => {
            this.props.flipCard()
            this.setState({ result: `Push - play again!` })
          }, 1000)
        }
      })
  }

  onPlayerHit() {
    const { playerCards, playerValue } = this.props.hand
    const { deck, result } = this.state
    this.props.dealOneCard(deck, 'player')
      .then(() => {
        const { playerValue } = this.props.hand
        if (playerValue > 21) {
          this.props.flipCard()
          this.setState({ result: 'You busted! Dealer wins.' })
        }
      })
  }

  onDoubleDown() {
    this.onPlayerHit()
    setTimeout(() => {
      if (!this.state.result) this.onPlayerStand()
    }, 1000)
  }

  onPlayerStand() {
    this.props.flipCard()
    setTimeout(() => this.onCheckHands(), 1000)
  }

  onCheckHands(double) {
    const { dealerValue, dealerCards, playerValue } = this.props.hand
    const { result, deck } = this.state
    if (dealerValue <= 16) {
      this.props.dealOneCard(deck, 'dealer')
        .then(() => setTimeout(() => this.onCheckHands(), 1000))
    }
    else if (dealerValue > 21) {
      return setTimeout(() => this.setState({ result: `You win! Dealer busts!` }), 1000)
    }
    else {
      if (dealerValue > playerValue) {
        return setTimeout(() => this.setState({ result: `Dealer wins with ${dealerValue}` }), 1000)
      }
      else if (playerValue > dealerValue) {
        return setTimeout(() => this.setState({ result: `You win with ${playerValue}!` }), 1000)
      }
      else {
        return setTimeout(() => this.setState({ result: 'Push - play again!' }), 1000)
      }
    }
  }

  render() {
    const { onStartHand, onNewDeck, onPlayerHit, onPlayerStand, onDoubleDown } = this
    const { dealerCards, dealerValue, dealerHiddenCard, playerCards, playerValue, playerStand } = this.props.hand
    const { result } = this.state
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
              source={ cardBack }
            />
          </View>
        }
        { dealerCards.length &&
          dealerCards.map((card, index) => (
            <View style={{ alignSelf: 'center' }} key={index}>
              <Image style={ styles.image } source={{ uri: `${card.image}` }} />
            </View>
          ))
        }
        </View>
        <View style={ styles.inline }>
          <Button disabled={ noStartHand } onPress={ onStartHand } title="Start hand">Start hand</Button>
          <Button disabled={ noNewDeck } onPress={ onStartHand } title={ result ? ('Play again') : ('New hand') } />
          <Button disabled={ noNewDeck } onPress={ onNewDeck } title="New deck" />
        </View>

        <Text style={ styles.headline1 }>Player's Cards</Text>
        <Text style={ styles.headline2 }>Total: {playerValue}</Text>
        <View style={ styles.inline }>
          {playerCards.length &&
            playerCards.map((card, index) => (
              <View style={{ alignSelf: 'center' }} key={index}>
                <Image style={ styles.image } source={{ uri: `${card.image}` }} />
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
    width: 55,
    height: 77,
    alignSelf: 'center'
  }
})


const mapState = ({ hand }) => {
  return { hand }
}

const mapDispatch = (dispatch) => {
  return {
    dealOneCard: (deck, player) => dispatch(dealOneCard(deck, player)),
    newDeck: () => dispatch(newDeck()),
    newHand: (deck) => dispatch(newHand(deck)),
    flipCard: () => dispatch(flipCard())
  }
}

export default connect(mapState, mapDispatch)(Dealer);
