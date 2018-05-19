import React from 'react';
import { View, ScrollView, Text, StyleSheet, Button } from 'react-native'

const Hint = () => {
  return (
    <View style={ styles.conatiner }>
      <Text>Based on the dealer's cards and your cards, you should stay</Text>
      <Button title="Close" onPress={() => this.props.navigation.goBack()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Hint
