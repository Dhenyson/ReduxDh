import { createStore } from 'redux';
import Reducers from './reducers/index.js';

const store = createStore(Reducers);

export default store;