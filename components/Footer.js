import React from 'react';
import { View, Text, StyleSheet } from 'react-native'

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>&copy; Jeremy Philipson</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 20,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100000,
  },
  text: {
    fontSize: 12,
    color: 'white'
  }
})

export default Footer;
