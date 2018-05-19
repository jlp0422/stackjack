/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux';
import { getHint } from '../probability';

const HintInfo = ({ dealerValue, playerValue, playerStand, goBack }) => {
  if (playerValue && dealerValue && !playerStand) {
    return (
      <View style={styles.hint}>
        <Text style={ styles.text }>Dealer showing: {dealerValue}</Text>
        <Text style={ styles.text }>You have: {playerValue}</Text>
        <Text style={styles.odds}>Odds say: { getHint(playerValue, dealerValue) }</Text>
        <Button title="Close" onPress={ goBack } />
      </View>
    )
  }
  else if (playerStand) {
    return (
      <View style={styles.hint}>
        <Text style={styles.odds}>Start a new hand to get a hint!</Text>
        <Button title="Close" onPress={goBack} />
      </View>
    )
  }
  else {
    return (
    <View style={styles.hint}>
      <Text style={styles.odds}>Start a hand to get a hint!</Text>
      <Button title="Close" onPress={goBack} />
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
  },
  odds: {
    fontSize: 30,
    textAlign: 'center',
    paddingBottom: 30,
    fontWeight: 'bold'
  }
});

const mapState = ({ hand }, { goBack }) => {
  const { dealerValue, playerValue, playerStand } = hand
  return { dealerValue, playerValue, playerStand, goBack }
}

export default connect(mapState)(HintInfo);
