/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button, Alert } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Provider, connect } from 'react-redux';
import store from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import Dealer from './components/Dealer';
import HintInfo from './components/HintInfo';
import AddFundsInfo from './components/AddFunds'

class App extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerRight: (
        <Button
          onPress={() => navigation.navigate('Hint')}
          title="Hint"
          color="#fff"
        />
      ),
      headerLeft: (
        <Button
          onPress={() => navigation.navigate('AddFunds')}
          title="Add Funds"
          color="#fff"
        />
      ),
    }
  }

  render() {
    console.log('***** TIME FOR STACKJACK ******')
    return (
      <Provider store={ store }>
      <View style={styles.container}>
        {/*<Header />*/}
        <ScrollView>
          <Dealer />
        </ScrollView>
        <Footer />
      </View>
      </Provider>
    );
  }
}

class Hint extends React.Component {
  constructor() {
    super()
    this.onGoBack = this.onGoBack.bind(this)
  }
  static navigationOptions = {
    title: 'Hint',
  };

  onGoBack() {
    this.props.navigation.goBack()
  }

  render() {
    const { onGoBack } = this
    return (
      <Provider store={ store }>
        <HintInfo goBack={ onGoBack } />
      </Provider>
    )
  }
}

class AddFunds extends React.Component {
  constructor() {
    super()
    this.onGoBack = this.onGoBack.bind(this)
  }
  static navigationOptions = {
    title: 'Add Funds',
  };

  onGoBack() {
    this.props.navigation.goBack()
  }

  render() {
    const { onGoBack } = this
    return (
      <Provider store={store}>
        <AddFundsInfo goBack={onGoBack} />
      </Provider>
    )
  }
}

const MainStack = createStackNavigator(
  {
    Home: { screen: App },
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      title: 'StackJack',
      headerStyle: { backgroundColor: '#128632' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', },
    }
  }
)

const RootStack = createStackNavigator(
  {
    Main: { screen: MainStack },
    Hint: { screen: Hint },
    AddFunds: { screen: AddFunds }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default class stack extends React.Component {
  render() {
    return <RootStack />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  hint: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 25,
    paddingRight: 25
  },
  text: {
    textAlign: 'center'
  }
});
