/* eslint-disable */
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

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
      )
    }
  }

  render() {
    console.log('***** TIME FOR STACKJACK ******')
    return (
      <Provider store={ store }>
      <View style={styles.container}>
        {/*<Header />*/}
        <ScrollView>
          <Main />
        </ScrollView>
        <Footer />
      </View>
      </Provider>
    );
  }
}

class Hint extends React.Component {
  static navigationOptions = {
    title: 'Hint',
  };

  render() {
    return (
      <View style={styles.hint}>
        <Text style={ styles.text } >Based on the dealer's cards and your cards, you should stay</Text>
        <Button title="Close" onPress={ () => this.props.navigation.goBack() } />
      </View>
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
    Hint: { screen: Hint }
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
