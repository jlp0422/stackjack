/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableHighlight } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { dealOneCard, newDeck, newHand, flipCard } from '../store/HandReducer';

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
    this.onFlipDealerCard = this.onFlipDealerCard.bind(this)
  }

  componentWillMount() {
    this.onNewDeck()
  }

  // keep this for dealer flipped card value
  getCardValue(value) {
    // right now, counts ACE as 11
    if (value * 1) return value * 1
    else if (value === 'ACE') return 11
    else return 10
  }

  onNewDeck() {
    // this.props.newDeck()
    axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
      .then(res => res.data)
      .then(deck => this.setState({
        deck: deck.deck_id,
        result: '',
      }))
  }

  onStartHand() {
    const { deck } = this.state
    this.setState({ result: '' })
    this.props.newHand(deck)
      .then(() => {
        const { playerValue, dealerValue, dealerHiddenCard } = this.props.hand
        const realDealerValue = dealerValue + this.getCardValue(dealerHiddenCard.value)
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
    const { deck } = this.state
    this.props.dealOneCard(deck, 'player')
    setTimeout(() => this.onPlayerStand(), 1000)
  }

  onFlipDealerCard() {
    this.props.flipCard()
    const { dealerValue, dealerCards, dealerHiddenCard, playerValue } = this.props.hand
    const { result, deck } = this.state
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
              source={require('./../card-back.jpg')}
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
