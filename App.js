import React from 'react';
import {StyleSheet, Text} from 'react-native';

import { Provider, connect } from 'react-redux';
import Store from './src/Store.js';

const App = (props) => {
  return (
    <Provider store={Store}>
      <Text>Hello world!</Text>
    </Provider>
  );
};

const styles = StyleSheet.create({

});

const mapStateToProps = (state) => {
  return {
    name: state.userReducer.name,
    email: state.userReducer.email
  };
}

const mapDispatchToProps = () => {
  return {};
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
