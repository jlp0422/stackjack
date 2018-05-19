/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Provider } from 'react-redux';
import store from './store'

import Header from './Header';
import Footer from './Footer';
import Main from './Main';

export default class App extends React.Component {
  render() {
    console.log('***** TIME FOR STACKJACK ******')
    return (
      <Provider store={ store }>
      <View style={styles.container}>
        <Header />
        <ScrollView>
          <Main />
        </ScrollView>
        <Footer />
      </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
