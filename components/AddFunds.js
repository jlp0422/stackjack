/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { addFundsToAccount } from '../store/HandReducer';

const AddFundsInfo = ({ addFunds, playerBankroll, goBack }) => {
  return (
    <View style={styles.hint}>
      <Text style={styles.text}>Add money to your bankroll?</Text>
      <Button title="Add $25" onPress={ addFunds } />
      <Button title="Not right now" onPress={ goBack } />
    </View>
  )
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
  },
  odds: {
    fontSize: 30,
    textAlign: 'center',
    paddingBottom: 30,
    fontWeight: 'bold'
  }
});

const mapState = ({ hand }, { goBack }) => {
  const { playerBankroll } = hand
  return { playerBankroll, goBack }
}

const mapDispatch = (dispatch, { goBack }) => {
  return {
    addFunds: () => {
      dispatch(addFundsToAccount())
      goBack()
    }
  }
}

export default connect(mapState, mapDispatch)(AddFundsInfo);
