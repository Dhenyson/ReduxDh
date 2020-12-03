import React from 'react';

import { Provider } from 'react-redux';
import Store from './src/Store.js';

import Login from './Login.js'

export default () => (
    <Provider store={Store}>
      <Login />
    </Provider>
  );