/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { connect } from 'react-redux';
import { addFundsToAccount } from '../store/HandReducer';

// add input amount?

class AddFundsInfo extends React.Component {
  constructor() {
    super()
    this.state = {
      amount: '10'
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
          onPress: () => addFunds(amount * 1),
          style: 'default',
        },
      ]
    )
  }

  render() {
    const { addFunds, playerBankroll, goBack } = this.props
    const { onAddNow } = this
    const { amount } = this.state
    return (
      <View style={styles.hint}>
        <Text style={styles.text}>Add money to your bankroll?</Text>
        <TextInput
          style={ styles.amount }
          onChangeText={(text) => this.setState({ amount: text })}
          keyboardType='numeric'
          value={amount}
        />
        <View ><Button title="Add now" onPress={ onAddNow } /></View>
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
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25
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
