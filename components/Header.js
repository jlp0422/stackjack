import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const Header = () => {
  return (
    <View style={ styles.container }>
      <Text style={ styles.text }>Play Game</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 40,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100000,
  },
  text: {
    fontSize: 25,
    color: 'white'
  }
});

export default Header;
