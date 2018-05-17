/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Header from './Header';
import Footer from './Footer';
import Main from './Main';

export default class App extends React.Component {
  render() {
    console.log('***** YOOOO ******')
    return (
      <View style={styles.container}>
        <Header />
        <Main />
        <Footer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
