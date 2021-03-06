/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, Image, Button, TextInput, TouchableWithoutFeedback, Alert } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import { dealOneCard, newDeck, newHand, flipCard, playerWin, playerLose, makeAceOne, addFundsToAccount } from '../store/HandReducer';
import { getCardValue, formatNumber } from '../store/actionConstants';
const cardBack = require('../card-back.jpg')

const playerAceTracker = {}
const dealerAceTracker = {}

class Dealer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      deck: '',
      result: '',
      wager: 0,
      doubledDown: false
    }
    this.onStartHand = this.onStartHand.bind(this)
    this.onNewDeck = this.onNewDeck.bind(this)
    this.onPlayerHit = this.onPlayerHit.bind(this)
    this.onPlayerStand = this.onPlayerStand.bind(this)
    this.onDoubleDown = this.onDoubleDown.bind(this)
    this.onCheckHands = this.onCheckHands.bind(this)
    this.onWagerChange = this.onWagerChange.bind(this)
    this.onPlayerWin = this.onPlayerWin.bind(this)
    this.onPlayerLose = this.onPlayerLose.bind(this)
    this.onCheckForAce = this.onCheckForAce.bind(this)
    this.addFundsPrompt = this.addFundsPrompt.bind(this)
  }

  componentWillMount() {
    this.onNewDeck()
  }

  onWagerChange(stakeType) {
    let { wager } = this.state
    const { playerBankroll } = this.props.hand
    if (stakeType === 'increase') {
      if (wager * 1 === playerBankroll * 1 ) return
      else this.setState({ wager: wager + 1 })
    }
    else if (stakeType === 'decrease') {
      if (wager === 0) return
      else this.setState({ wager: wager - 1 })
    }
  }

  addFundsPrompt() {
    const { playerBankroll } = this.props.hand
    Alert.alert(
      'Add $25 to your bankroll?',
      `You currently have $${ formatNumber(playerBankroll) }`,
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'Yes', onPress: () => this.props.addFunds(), style: 'default' },
      ],
      { cancelable: false }
    )
  }

  onPlayerWin(stackjack) {
    const { wager, doubledDown } = this.state
    const winningMoney = stackjack ? wager * 1.2 : wager
    this.props.playerWin(winningMoney)
    if (doubledDown) this.setState({ doubledDown: false, wager: wager / 2 })
  }

  onPlayerLose() {
    const { wager, doubledDown } = this.state
    this.props.playerLose(wager)
    if (doubledDown) this.setState({ doubledDown: false, wager: wager / 2 })
  }

  onCheckForAce(cards, player) {
    if (player === 'player') {
      const playerAceCount = cards.reduce((memo, card) => {
        if (card.value === 'ACE') memo++
        return memo
      }, 0)
      if (playerAceCount && !playerAceTracker[playerAceCount]) playerAceTracker[playerAceCount] = { checked: true }
      else if (playerAceCount) {
        playerAceTracker[playerAceCount].checked = true
        playerAceTracker[playerAceCount].subtracted = true
      }
      return playerAceCount
    }
  else {
    const dealerAceCount = cards.reduce((memo, card) => {
      if (card.value === 'ACE') memo++
      return memo
    }, 0)
    if (dealerAceCount && !dealerAceTracker[dealerAceCount]) dealerAceTracker[dealerAceCount] = { checked: true }
    else if (dealerAceCount) {
      dealerAceTracker[dealerAceCount].checked = true
      dealerAceTracker[dealerAceCount].subtracted = true
    }
    return dealerAceCount
  }
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
    const { deck, wager } = this.state
    const { playerBankroll } = this.props.hand
    playerAceTracker = {}
    if (wager > playerBankroll) return Alert.alert('Hold up', `You can't fund that bet!`)
    else {
      this.setState({ result: '' })
      this.props.newHand(deck)
        .then(() => {
          const { playerValue, dealerValue, dealerHiddenCard, playerCards, dealerCards } = this.props.hand
          const realDealerValue = dealerValue + getCardValue(dealerHiddenCard.value)
          if (playerValue > 21) this.props.makeAceOne('player')
          if (realDealerValue > 21) this.props.makeAceOne('dealer')
        })
        .then(() => {
          const { playerValue, dealerValue, dealerHiddenCard, playerCards, dealerCards } = this.props.hand
          const realDealerValue = dealerValue + getCardValue(dealerHiddenCard.value)
          if (playerValue === 21 && realDealerValue === 21 ) {
            return setTimeout(() => {
              this.props.flipCard()
              this.setState({ result: `Push - play again!` })
            }, 500)
          }
          else if (playerValue === 21) {
            return setTimeout(() => {
              this.props.flipCard()
              this.setState({ result: `You win with StackJack!` })
              this.onPlayerWin('blackjack')
            }, 500)
          }
          else if (realDealerValue === 21) {
            return setTimeout(() => {
              this.props.flipCard()
              this.setState({ result: `Dealer has StackJack` })
              this.onPlayerLose()
            }, 500)
          }
        })
      }
  }

  onDoubleDown() {
    const { wager } = this.state
    const { playerBankroll } = this.props.hand
    if (wager * 2 > playerBankroll) return Alert.alert('Hold up', 'You dont have enough money to Double Down!')
    else {
      this.setState({ wager: wager * 2 })
      this.setState({ doubledDown: true })
      setTimeout(() => this.onPlayerHit(), 200)
      setTimeout(() => {
        if (!this.state.result) this.onPlayerStand()
      }, 1000)
    }
  }

  onPlayerHit() {
    const { deck } = this.state
    this.props.dealOneCard(deck, 'player')
      .then(() => {
        const { playerValue, playerCards } = this.props.hand
        let playerAceCount = this.onCheckForAce(playerCards, 'player')
        if (playerValue > 21 && playerAceCount && playerAceTracker[playerAceCount].checked && !playerAceTracker[playerAceCount].subtracted) {
          this.props.makeAceOne('player')
          playerAceTracker[playerAceCount].checked = true
          playerAceTracker[playerAceCount].subtracted = true
        }
      })
      .then(() => {
        const { playerValue } = this.props.hand
        setTimeout(() => {
            if (playerValue > 21) {
            this.props.flipCard()
            this.setState({ result: 'You busted! Dealer wins.' })
            this.onPlayerLose()
          }
        }, 500)
      })
  }

  onPlayerStand() {
    this.props.flipCard()
    setTimeout(() => this.onCheckHands(), 750)
  }

  onCheckHands(double) {
    const { dealerValue, dealerCards, playerValue } = this.props.hand
    const { result, deck } = this.state
    if (dealerValue <= 16) {
      this.props.dealOneCard(deck, 'dealer')
        .then(() => {
          const { dealerValue, dealerCards } = this.props.hand
          let dealerAceCount = this.onCheckForAce(dealerCards, 'dealer')
          if (dealerValue > 21 && dealerAceCount && dealerAceTracker[dealerAceCount].checked && !dealerAceTracker[dealerAceCount].subtracted) {
            this.props.makeAceOne('dealer')
            dealerAceTracker[dealerAceCount].checked = true
            dealerAceTracker[dealerAceCount].subtracted = true
          }
        })
        .then(() => setTimeout(() => this.onCheckHands(), 750))
    }
    else if (dealerValue > 21) {
      return setTimeout(() => {
        this.setState({ result: `You win! Dealer busts!` })
        this.onPlayerWin()
      }, 500)
    }
    else {
      if (dealerValue > playerValue) {
        return setTimeout(() => {
          this.setState({ result: `Dealer wins with ${dealerValue}` })
          this.onPlayerLose()
        }, 500)
      }
      else if (playerValue > dealerValue) {
        return setTimeout(() => {
          this.setState({ result: `You win with ${playerValue}!` })
          this.onPlayerWin()
        }, 500)
      }
      else {
        return setTimeout(() => this.setState({ result: 'Push - play again!' }), 500)
      }
    }
  }

  render() {
    const { onStartHand, onNewDeck, onPlayerHit, onPlayerStand, onDoubleDown, onWagerChange, addFundsPrompt } = this
    const { dealerCards, dealerValue, dealerHiddenCard, playerCards, playerValue, playerStand, playerBankroll } = this.props.hand
    const { result, wager } = this.state
    /* BUTTON DISABLING */
    const noStartHand = playerCards.length > 1
    const noNewDeck = !dealerCards.length || !playerCards.length
    const noPlayerCards = !playerCards.length
    const playerBust = playerValue > 21
    const noBet = playerCards.length > 1 && !result
    const playerAction = noPlayerCards || playerBust || !!result

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

        <Text style={ styles.headline1 }>Your Cards</Text>
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
          <Button onPress={ onPlayerHit } disabled={ playerAction } title="Hit" />
          <Button onPress={ onPlayerStand } disabled={ playerAction } title="Stand" />
          <Button onPress={ onDoubleDown } disabled={ playerAction || playerCards.length > 2 } title="Double Down" />
        </View>
        <View style={ styles.inline }>
          <Text style={ styles.headline1 }>Wager:</Text>
          <TouchableWithoutFeedback disabled={ noBet } onPress={() => onWagerChange('decrease')}>
            <View>
              <Text style={ [ styles.betButton, { color: noBet ? 'gray' : 'black', borderColor: noBet ? 'gray' : 'black', } ] }>
                {/* minus sign*/}
                &#x2D;
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <Text style={ [ styles.betText, { color: noBet ? 'gray' : 'black' }] }>${wager}</Text>
          <TouchableWithoutFeedback disabled={ noBet } onPress={() => onWagerChange('increase')}>
            <View>
              <Text style={ [ styles.betButton, { color: noBet ? 'gray' : 'black', borderColor: noBet ? 'gray' : 'black', } ] }>
                {/* plus sign*/}
                &#x2B;
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Text style={ styles.headline2 }>My Bankroll: ${ formatNumber(playerBankroll) }</Text>
        <Button onPress={ addFundsPrompt } title="Add $25 to Bankroll" disabled={ playerBankroll > 5 }/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
    paddingTop: 20,
    minWidth: '90%'
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
    fontSize: 25,
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
  },
  betButton: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  betText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
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
    flipCard: () => dispatch(flipCard()),
    playerWin: (stake) => dispatch(playerWin(stake)),
    playerLose: (stake) => dispatch(playerLose(stake)),
    makeAceOne: (player) => dispatch(makeAceOne(player)),
    addFunds: () => dispatch(addFundsToAccount(25))
  }
}

export default connect(mapState, mapDispatch)(Dealer);
