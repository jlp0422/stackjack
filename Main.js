/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import Dealer from './Dealer'

const Main = () => {
  return (
    <View style={ styles.container }>
      <Dealer />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    // height: 600,
  }
})

export default Main;
