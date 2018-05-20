/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, ActivityIndicator, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { addFundsToAccount } from '../store/HandReducer';

// add input amount?

class AddFundsInfo extends React.Component {
  constructor() {
    super()
    this.state = {
      amount: '10',
      isAdding: false,
      doneAdding: false,
      error: ''
    }
    this.onAddNow = this.onAddNow.bind(this)
  }

  onAddNow() {
    const { amount } = this.state
    const { addFunds } = this.props
    Alert.alert(
      'Confirm deposit',
      `$${amount} will be added to your bankroll`,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            if (!(amount * 1)) return this.setState({ error: 'Please enter a valid number'})
            else {
              this.setState({ isAdding: true, doneAdding: true, error: '' })
              setTimeout(() => addFunds(amount * 1), 1000);
              setTimeout(() => this.setState({ isAdding: false }), 1200);
            }
          },
          style: 'default',
        },
      ]
    )
  }

  render() {
    const { addFunds, playerBankroll, goBack } = this.props
    const { onAddNow } = this
    const { amount, isAdding, doneAdding, error } = this.state
    return (
      <View style={styles.hint}>
        <Text style={styles.text}>Add money to your bankroll?</Text>
        { error && <Text style={{ fontSize: 20, color: 'red' }}>{error}</Text>}
        {
          isAdding ? (
            <View style={ styles.loading }>
              <ActivityIndicator size="large" color="#00ff00" />
            </View>
          ) : (
            <TextInput
              autoFocus={ !doneAdding }
              // autoFocus
              style={ styles.amount }
              onChangeText={(text) => this.setState({ amount: text })}
              keyboardType='numeric'
              value={amount}
            />
          )
        }
        <View><Button title="Add now" onPress={ onAddNow } /></View>
        <View style={ styles.button }><Button title="Back to game" onPress={ goBack } /></View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  hint: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 100
  },
  amount: {
    fontSize: 30,
    paddingTop: 20,
    paddingBottom: 25,
    fontWeight: 'bold'
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    paddingBottom: 10
  },
  button: {
    paddingTop: 20
  },
  loading: {
    padding: 22
  }
});

const mapState = ({ hand }, { goBack }) => {
  const { playerBankroll } = hand
  return { playerBankroll, goBack }
}

const mapDispatch = (dispatch, { goBack }) => {
  return {
    addFunds: (amount) => {
      dispatch(addFundsToAccount(amount))
      goBack()
    }
  }
}

export default connect(mapState, mapDispatch)(AddFundsInfo);
