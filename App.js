import React from 'react';
import {StyleSheet, Text} from 'react-native';

import { Provider, connect } from 'react-redux';
import Store from './src/Store.js';

import Login from './Login.js'

const App = (props) => {
  return (
    <Provider store={Store}>
      <Login />
    </Provider>
  );
};

const styles = StyleSheet.create({

});

export default App
