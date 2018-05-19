/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Dealer from './Dealer';

const Main = () => {
  return (
    <View>
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
