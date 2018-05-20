/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { addFundsToAccount } from '../store/HandReducer';

// add input amount?

class AddFundsInfo extends React.Component {
  constructor() {
    super()
    this.state = {
      amount: '10'
    }
  }

  render() {
    const { addFunds, playerBankroll, goBack } = this.props
    const { amount } = this.state
    return (
      <View style={styles.hint}>
        <Text style={styles.text}>Add money to your bankroll?</Text>
        <TextInput
          style={{ fontSize: 30, padding: 20 }}
          onChangeText={(text) => this.setState({ amount: text })}
          keyboardType='numeric'
          value={amount}
        />
        <Button title="Add now" onPress={() => addFunds(amount * 1) } />
        <Button title="Not right now" onPress={ goBack } />
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
  text: {
    textAlign: 'center',
    fontSize: 30,
    paddingBottom: 10
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
